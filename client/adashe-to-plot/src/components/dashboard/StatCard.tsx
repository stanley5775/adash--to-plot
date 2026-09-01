import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  tone?: "default" | "gold";
}) {
  return (
    <div className="flex items-start justify-between rounded-2xl border border-navy-800/10 bg-white p-5">
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-300">{label}</p>
        <p className={`mt-1 text-xl font-bold ${tone === "gold" ? "text-gold-600" : "text-navy-950"}`}>{value}</p>
      </div>
      {icon && (
        <div className={`rounded-xl p-2.5 ${tone === "gold" ? "bg-gold-100 text-gold-600" : "bg-navy-100 text-navy-700"}`}>
          {icon}
        </div>
      )}
    </div>
  );
}
