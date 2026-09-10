"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

const LAND_APPLICATION_FEE = 20000;

type ApplicationSuccessProps = {
  applicationId: string;
  paymentReference: string;
  onBack: () => void;
};

export default function ApplicationSuccess({
  applicationId,
  paymentReference,
  onBack,
}: ApplicationSuccessProps) {
  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-3xl border border-navy-800/10 bg-white p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-status-available" />

        <h2 className="text-2xl font-bold text-navy-950">
          🎉 Application Submitted Successfully
        </h2>

        <p className="max-w-md text-sm text-ink-500">
          Your land application has been submitted successfully and your
          application fee has been confirmed.
        </p>

        <div className="grid w-full max-w-sm grid-cols-2 gap-4 rounded-2xl bg-navy-50 p-5 text-left">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-300">
              Application Number
            </p>

            <p className="break-all font-bold text-navy-950">
              {applicationId || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-300">
              Payment
            </p>

            <p className="font-bold text-navy-950">
              ₦{LAND_APPLICATION_FEE.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-300">
              Status
            </p>

            <p className="font-bold text-status-available">Paid</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink-300">
              Reference
            </p>

            <p className="truncate font-bold text-navy-950">
              {paymentReference || "—"}
            </p>
          </div>
        </div>

        <Button onClick={onBack}>Back to Application</Button>

        <p className="flex items-center gap-1.5 text-xs text-ink-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Payment verified securely by Paystack.
        </p>
      </div>
    </div>
  );
}
