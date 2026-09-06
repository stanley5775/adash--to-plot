import type { Customer } from "@/types/customer";
import { Badge } from "@/components/ui/Badge";

export function DashboardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-navy-800/10 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
    </div>
  );
}
