"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { Upload, FileText, X, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { uploadDocument } from "@/app/actions/documents";
import { Button } from "@/components/ui/button";
import { formatFileSize, allowedTypes } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter();
  const { organization, isLoaded } = useOrganization();
  const [file, setFile] = useState<File | null>(null);

  const [state, action, isPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      if (!organization?.id) {
        return { error: "No active organization found." };
      }
      return await uploadDocument(formData, organization.id);
    },
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success("Document uploaded successfully!");
      router.push("/documents");
    }
  }, [state, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isAllowed = (allowedTypes as readonly string[]).includes(selectedFile.type);
      if (isAllowed) {
        setFile(selectedFile);
      } else {
        toast.error("Invalid file type. Please upload PDF, TXT, DOC, or MD.");
        e.target.value = "";
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    const input = document.getElementById("file-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-12 mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground mt-2">
          Add a new document to {organization?.name || "your organization"} for AI analysis.
        </p>
      </div>

      <form action={action} className="space-y-6">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 group",
            file
              ? "border-primary/50 bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/50"
          )}
        >
          <input
            type="file"
            name="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
            accept=".pdf,.txt,.doc,.docx,.md"
            disabled={isPending}
          />

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            {!file ? (
              <>
                <div className="p-4 bg-background rounded-full shadow-sm border group-hover:scale-110 transition-transform duration-200">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Click or drag file to upload</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, TXT, DOC, or MD up to 10MB
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 w-full bg-background p-4 rounded-lg border shadow-sm relative z-20">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium truncate pr-2">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                  onClick={removeFile}
                  disabled={isPending}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {state?.error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-start gap-3 border border-destructive/20 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{state.error}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="min-w-[140px]" 
            disabled={!file || isPending || !organization}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Document"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
