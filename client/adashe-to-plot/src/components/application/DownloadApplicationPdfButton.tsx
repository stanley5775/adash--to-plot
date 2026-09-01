"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { LoaderCircle, AlertTriangle } from "lucide-react";
import type { Application } from "@/types/application";
import { generateApplicationPdf } from "@/lib/pdf";

export function DownloadApplicationPdfButton({
  application,
  estateName,
  propertyTitle,
  children,
}: {
  application: Application;
  estateName: string;
  propertyTitle: string;
  children: ReactNode;
}) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    setError(false);
    try {
      await generateApplicationPdf(application, estateName, propertyTitle);
    } catch {
      setError(true);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleDownload}
        disabled={generating}
        className="inline-flex items-center gap-2 rounded-full border border-navy-800/15 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:border-navy-800/40 disabled:opacity-60"
      >
        {generating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {generating ? "Preparing PDF…" : children}
      </button>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-status-sold">
          <AlertTriangle className="h-3.5 w-3.5" /> Couldn&apos;t generate the PDF — please try again.
        </p>
      )}
    </div>
  );
}
