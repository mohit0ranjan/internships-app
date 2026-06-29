"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-red-100 p-4 text-red-600  ">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 ">Something went wrong!</h2>
        <p className="text-navy-500  max-w-[500px]">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
      </div>
      <Button onClick={() => reset()} className="mt-4 gap-2">
        <RefreshCcw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
