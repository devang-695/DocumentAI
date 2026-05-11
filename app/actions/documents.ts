"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAuthContext } from "@/lib/auth";
import { uploadToBlob } from "@/lib/blob";
import { allowedTypes, isAllowedFileType } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const uploadSchema = z.object({
  file: z.instanceof(File).refine((file) => isAllowedFileType(file.type), {
    message: "Invalid file type. Allowed types: TXT, PDF, DOC, MD",
  }),
});

export type UploadActionResponse = {
  error?: string;
  success?: boolean;
};

export async function uploadDocument(
  formData: FormData,
  organizationId: string
): Promise<UploadActionResponse> {
  const { user, org } = await getAuthContext();

  // Validate that the organizationId matches the active organization in the session
  // This ensures multi-tenant isolation even if the client sends a different ID.
  // We use clerkOrgId for comparison if organizationId looks like a Clerk ID.
  const isClerkId = organizationId.startsWith("org_");
  const targetOrgId = isClerkId ? org.clerkOrgId : org.id;

  if (targetOrgId !== organizationId) {
    return { error: "Organization access denied or mismatch." };
  }

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { error: "Please select a file to upload." };
  }

  const validation = uploadSchema.safeParse({ file });
  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  try {
    // 1. Upload to Blob
    const { url } = await uploadToBlob(file, org.clerkOrgId, user.clerkUserId);

    // 2. Extract content (Basic extraction for text-based files)
    let content = "";
    if (file.type === "text/plain" || file.type === "text/markdown") {
      content = await file.text();
    } else {
      content = `[Extraction required for ${file.type} - ${file.name}]`;
    }

    // 3. Prisma Transaction
    await prisma.$transaction(async (tx) => {
      const document = await tx.document.create({
        data: {
          name: file.name,
          content,
          userId: user.id,
          organizationId: org.id,
          file: {
            create: {
              url,
              type: file.type,
              size: file.size,
              name: file.name,
            },
          },
        },
      });

      // 4. Create pending DocumentAI record
      await tx.documentAI.create({
        data: {
          documentId: document.id,
          status: "pending",
        },
      });
    });

    revalidatePath("/documents");
    return { success: true };
  } catch (error) {
    console.error("Upload document error:", error);
    return { error: "An unexpected error occurred during upload." };
  }
}

export async function deleteDocument(documentId: string) {
  try {
    const { org, role } = await getAuthContext();

    // Verify role (owner/admin only)
    if (role !== "owner" && role !== "admin") {
      throw new Error("Only organization owners or admins can delete documents.");
    }

    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
        organizationId: org.id,
        deletedAt: null,
      },
    });

    if (!document) {
      throw new Error("Document not found or already deleted.");
    }

    await prisma.document.update({
      where: { id: documentId },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/documents");
    revalidatePath(`/documents/${documentId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Delete document error:", error);
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}
