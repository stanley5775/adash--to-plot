import Image from "next/image";
import Link from "next/link";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Home } from "lucide-react";

export default function MyPropertiesPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="My Properties"
        subtitle="Every property associated with your account."
      />

      {/* Property Card */}
      <Link
        href="/dashboard/properties/property-slug"
        className="flex flex-col gap-5 rounded-2xl border border-navy-800/10 bg-white p-6 transition-shadow hover:shadow-lg sm:flex-row sm:items-center">
        {/* Property Image */}
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:w-56">
          <Image
            src="/placeholder-property.jpg"
            alt="Property"
            fill
            className="object-cover"
          />
        </div>

        {/* Property Details */}
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-xs uppercase tracking-wide text-gold-600">
            Adashè Estate — Plot 24
          </p>

          <h3 className="text-lg font-bold text-navy-950">
            Premium Residential Plot
          </h3>

          <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MiniStat label="Price" value="₦5,000,000" />

            <MiniStat
              label="Purchase Status"
              value={
                <Badge tone={statusToTone("In Progress")}>In Progress</Badge>
              }
            />

            <MiniStat label="Payment Progress" value="50%" />

            <MiniStat label="Plan" value="24 Months" />
          </div>
        </div>
      </Link>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-300">{label}</p>

      <div className="mt-0.5 font-semibold text-navy-950">{value}</div>
    </div>
  );
}
