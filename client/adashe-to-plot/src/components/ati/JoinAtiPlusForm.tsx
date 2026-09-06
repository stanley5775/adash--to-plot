import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ANNUAL_FEE = 20000;

export function JoinAtiPlusForm() {
  return (
    <div className="flex flex-col gap-5">
      {/* Payment Summary */}
      <div className="rounded-2xl border border-gold-400 bg-gold-50 p-5">
        <div className="flex items-center gap-2 text-gold-700">
          <Wallet className="h-4 w-4" />

          <span className="text-sm font-bold uppercase tracking-wide">
            Annual Subscription Required
          </span>
        </div>

        <p className="mt-2 text-sm text-ink-700">
          ATI Plus membership requires a flat{" "}
          <strong>₦{ANNUAL_FEE.toLocaleString()}</strong> annual subscription,
          renewed every 12 months.
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-gold-400/40 pt-4 text-sm">
          <span className="text-ink-500">Amount due today</span>

          <span className="text-lg font-bold text-navy-950">
            ₦{ANNUAL_FEE.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Payment Button */}
      <Button className="w-full">
        Pay ₦{ANNUAL_FEE.toLocaleString()} & Join
      </Button>

      <p className="text-center text-xs text-ink-400">
        ATI Plus membership is renewed annually.
      </p>
    </div>
  );
}
