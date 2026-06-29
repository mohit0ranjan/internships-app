"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <div className="rounded-full bg-red-50 p-4 text-red-500 border border-red-100">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-navy-900">Unable to load workspace</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          We encountered a problem loading your data. This might be a temporary network issue.
        </p>
        <div className="mt-4 p-2 bg-red-100 text-red-800 text-xs text-left rounded overflow-auto max-h-32">
          {error.message}
        </div>
      </div>
      <Button onClick={() => reset()} variant="outline" className="mt-4 gap-2 border-slate-200">
        <RefreshCcw className="h-4 w-4" /> Try Again
      </Button>
    </div>
  );
}
