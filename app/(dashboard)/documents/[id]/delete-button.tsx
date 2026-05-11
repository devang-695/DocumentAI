"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteDocument } from "@/app/actions/documents";

interface DeleteDocumentButtonProps {
  documentId: string;
}

export function DeleteDocumentButton({ documentId }: DeleteDocumentButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }

    setIsPending(true);
    const result = await deleteDocument(documentId);
    setIsPending(false);

    if (result.success) {
      toast.success("Document deleted successfully.");
      router.push("/documents");
    } else {
      toast.error(result.error || "Failed to delete document.");
    }
  }

  return (
    <Button
      variant="destructive"
      className="w-full"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deleting
        </>
      ) : (
        <>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Document
        </>
      )}
    </Button>
  );
}
