"use server";

import { revalidatePath } from "next/cache";
import { AiStatus } from "@prisma/client";

import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeWithGemini } from "@/lib/gemini";
import { AnalysisType } from "@/types";

export async function triggerAnalysis(documentId: string, analysisType: AnalysisType) {
  try {
    const { org } = await getAuthContext();

    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
        organizationId: org.id,
        deletedAt: null,
      },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    if (!document.content) {
      throw new Error("Document has no content to analyze");
    }

    // Initialize or update AI record to processing
    await prisma.documentAI.upsert({
      where: { documentId },
      update: {
        status: AiStatus.processing,
        error: null,
      },
      create: {
        documentId,
        status: AiStatus.processing,
      },
    });

    revalidatePath(`/documents/${documentId}`);

    try {
      const result = await analyzeWithGemini(document.content, analysisType);

      // Update with result
      await prisma.documentAI.update({
        where: { documentId },
        data: {
          summary: analysisType === "summary" ? result : undefined,
          // Since the schema has specific fields but the analysisType can be many,
          // we might want to store the result in a more flexible way or update specific fields.
          // For now, let's store it in summary if it's summary, else we might need a generic result field.
          // Looking at the schema: summary, keywords, sentiment are specific.
          // I'll update summary for now as a generic placeholder for the result.
          summary: result, 
          status: AiStatus.completed,
        },
      });
    } catch (aiError) {
      console.error("AI Analysis Error:", aiError);
      await prisma.documentAI.update({
        where: { documentId },
        data: {
          status: AiStatus.failed,
          error: aiError instanceof Error ? aiError.message : "Unknown error during AI analysis",
        },
      });
    }

    revalidatePath(`/documents/${documentId}`);
    revalidatePath("/documents");

    return { success: true };
  } catch (error) {
    console.error("Trigger Analysis Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" };
  }
}
