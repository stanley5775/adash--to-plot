import { Check } from "lucide-react";
import type { Application, ApplicationStage } from "@/types/application";

const STAGES: ApplicationStage[] = [
  "Application Started",
  "Application Submitted",
  "Payment Confirmed",
  "Under Review",
  "Approved",
  "Allocation",
];

export function ApplicationTimeline({ application }: { application: Application }) {
  const currentIndex = STAGES.indexOf(application.currentStage);

  return (
    <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
      <h3 className="text-base font-bold text-navy-950">Land Application Progress</h3>
      <ol className="mt-6 space-y-0">
        {STAGES.map((stage, i) => {
          const done = i < currentIndex || application.stagesCompleted.includes(stage);
          const current = i === currentIndex;
          const isLast = i === STAGES.length - 1;
          return (
            <li key={stage} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-[15px] top-8 h-full w-0.5 ${done ? "bg-gold-500" : "bg-navy-800/10"}`}
                />
              )}
              <span
                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-gold-500 text-navy-950"
                    : current
                    ? "border-2 border-gold-500 bg-white text-gold-600"
                    : "border border-navy-800/20 bg-white text-ink-300"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <div className="pt-1">
                <p className={`text-sm font-semibold ${done || current ? "text-navy-950" : "text-ink-300"}`}>{stage}</p>
                {current && <p className="mt-0.5 text-xs text-gold-600">In progress</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
