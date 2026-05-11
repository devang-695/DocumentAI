import Link from "next/link";
import { Plus, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatFileSize } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DocumentsPage() {
  const { org } = await getAuthContext();

  const documents = await prisma.document.findMany({
    where: {
      organizationId: org.id,
      deletedAt: null,
    },
    include: {
      file: true,
      aiAnalysis: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage and analyze your organization&apos;s documents.
          </p>
        </div>
        <Button asChild>
          <Link href="/documents/upload">
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Upload your first document to start using AI-powered analysis.
          </p>
          <Button asChild variant="outline">
            <Link href="/documents/upload">
              Upload your first document
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Size</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <td className="p-4 align-middle">
                    <Link href={`/documents/${doc.id}`} className="font-medium hover:underline flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-blue-500" />
                      {doc.name}
                    </Link>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {formatFileSize(doc.file?.size)}
                  </td>
                  <td className="p-4 align-middle">
                    <AiStatusBadge status={doc.aiAnalysis?.status || "pending"} />
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {doc.createdAt.toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/documents/${doc.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AiStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Pending
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
          <AlertCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
