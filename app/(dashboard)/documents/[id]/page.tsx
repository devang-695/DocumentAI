import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Calendar, HardDrive, User, ArrowLeft, Brain, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { getAuthContext } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatFileSize } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AnalysisActions } from "./analysis-actions";
import { DeleteDocumentButton } from "./delete-button";

interface DocumentDetailPageProps {
  params: {
    id: string;
  };
}

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { id } = await params;
  const { org, role } = await getAuthContext();

  const document = await prisma.document.findUnique({
    where: {
      id,
      organizationId: org.id,
      deletedAt: null,
    },
    include: {
      file: true,
      aiAnalysis: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!document) {
    notFound();
  }

  const canDelete = role === "owner" || role === "admin";
  const aiStatus = document.aiAnalysis?.status || "pending";

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href="/documents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="mr-3 h-6 w-6 text-blue-500" />
                  {document.name}
                </CardTitle>
                <CardDescription>
                  Uploaded on {document.createdAt.toLocaleDateString()}
                </CardDescription>
              </div>
              <AiStatusBadge status={aiStatus} />
            </CardHeader>
            <CardContent>
              {aiStatus === "completed" && document.aiAnalysis?.summary ? (
                <div className="prose prose-sm dark:prose-invert max-w-none border rounded-lg p-6 bg-muted/30">
                  <ReactMarkdown>{document.aiAnalysis.summary}</ReactMarkdown>
                </div>
              ) : aiStatus === "processing" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                  <h3 className="text-lg font-medium">Analyzing document...</h3>
                  <p className="text-muted-foreground">
                    Gemini AI is processing your document. This usually takes a few seconds.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                  <Brain className="h-8 w-8 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No analysis results yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Run an AI analysis to extract insights from this document.
                  </p>
                  <AnalysisActions documentId={document.id} />
                </div>
              )}
            </CardContent>
          </Card>

          {aiStatus === "completed" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Run Another Analysis</CardTitle>
                <CardDescription>
                  Choose a different analysis type to get more insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalysisActions documentId={document.id} />
              </CardContent>
            </Card>
          )}

          {aiStatus === "failed" && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-lg text-red-700 dark:text-red-400 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Analysis Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 dark:text-red-300">
                  {document.aiAnalysis?.error || "An unknown error occurred during analysis."}
                </p>
                <div className="mt-4">
                  <AnalysisActions documentId={document.id} label="Retry Analysis" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <HardDrive className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium mr-2">Size:</span>
                <span className="text-muted-foreground">{formatFileSize(document.file?.size)}</span>
              </div>
              <div className="flex items-center text-sm">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium mr-2">Type:</span>
                <span className="text-muted-foreground">{document.file?.type}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium mr-2">Uploaded:</span>
                <span className="text-muted-foreground">{document.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium mr-2">By:</span>
                <span className="text-muted-foreground">{document.user.name || document.user.email}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4 border-t">
              <Button asChild variant="outline" className="w-full">
                <a href={document.file?.url} target="_blank" rel="noopener noreferrer">
                  Download Original
                </a>
              </Button>
              {canDelete && (
                <DeleteDocumentButton documentId={document.id} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
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
