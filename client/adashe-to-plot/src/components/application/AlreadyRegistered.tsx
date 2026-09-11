
"use client";

import Link from "next/link";
import { CheckCircle2, FileText, ArrowRight } from "lucide-react";

export default function AlreadyRegistered() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-3xl border border-navy-800/10 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-available/10">
          <CheckCircle2 className="h-8 w-8 text-status-available" />
        </div>

        <div className="mt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
            <FileText className="h-3.5 w-3.5" />
            Application submitted
          </span>

          <h1 className="mt-4 text-2xl font-bold text-navy-950 sm:text-3xl">
            You already have a land application
          </h1>

          <p className="mt-3 text-sm leading-6 text-ink-500">
            You have already submitted a land application with
            Adashè-to-Plot. You cannot submit another application at this
            time.
          </p>

          <p className="mt-2 text-sm leading-6 text-ink-500">
            You can visit your dashboard to view your application status and
            manage your account.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/estates"
            className="inline-flex items-center justify-center rounded-full border border-navy-800/15 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-800/40 hover:bg-navy-50"
          >
            Explore Properties
          </Link>
        </div>
      </div>
    </div>
  );
}

