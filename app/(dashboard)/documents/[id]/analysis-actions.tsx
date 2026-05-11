"use client";

import { useState } from "react";
import { Brain, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { triggerAnalysis } from "@/app/actions/ai";
import { AnalysisType } from "@/types";

interface AnalysisActionsProps {
  documentId: string;
  label?: string;
}

const analysisOptions: { value: AnalysisType; label: string }[] = [
  { value: "summary", label: "Summary" },
  { value: "qa", label: "Q&A" },
  { value: "sentiment", label: "Sentiment" },
  { value: "entities", label: "Entities" },
  { value: "extract", label: "Extract Information" },
];

export function AnalysisActions({ documentId, label = "Run Analysis" }: AnalysisActionsProps) {
  const [isPending, setIsPending] = useState(false);
  const [selectedType, setSelectedType] = useState<AnalysisType>("summary");

  async function handleAnalyze() {
    setIsPending(true);
    const result = await triggerAnalysis(documentId, selectedType);
    setIsPending(false);

    if (result.success) {
      toast.success("Analysis started successfully.");
    } else {
      toast.error(result.error || "Failed to start analysis.");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm mx-auto">
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value as AnalysisType)}
        disabled={isPending}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {analysisOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <Button 
        onClick={handleAnalyze} 
        disabled={isPending}
        className="w-full sm:w-auto min-w-[140px]"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          <>
            <Brain className="mr-2 h-4 w-4" />
            {label}
          </>
        )}
      </Button>
    </div>
  );
}
