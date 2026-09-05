import type { Customer } from "@/types/customer";
import { Badge } from "@/components/ui/Badge";

export function DashboardHeader({ customer, title, subtitle }: { customer: Customer | null ; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-navy-800/10 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-navy-800/10 bg-white px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-950 text-sm font-bold text-white">
          {customer? customer.name.split(" ").map((n) => n[0]).join("") : ""}
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-950">{customer?.name}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            {customer?.isAtiPlusMember && <Badge tone="gold">ATI Plus</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
}
