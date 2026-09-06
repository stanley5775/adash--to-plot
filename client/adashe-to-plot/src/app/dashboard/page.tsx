import Image from "next/image";
import Link from "next/link";

import {
  Home,
  Wallet,
  Star,
  FileText,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge, statusToTone } from "@/components/ui/Badge";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        title="Overview"
        subtitle="A snapshot of your investment with Adashè-to-Plot."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Properties"
          value="1"
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Total Investment"
          value="₦5,000,000"
          icon={<Wallet className="h-4 w-4" />}
        />

        <StatCard
          label="Outstanding Balance"
          value="₦2,500,000"
          icon={<Wallet className="h-4 w-4" />}
          tone="gold"
        />

        <StatCard
          label="ATI Plus Status"
          value="Active Member"
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      {/* Property */}
      <div className="rounded-2xl border border-navy-800/10 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-navy-950">My Property</h3>

          <Badge tone={statusToTone("In Progress")}>Payment in progress</Badge>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Property Image */}
          <div className="relative h-40 w-full overflow-hidden rounded-xl lg:h-full">
            <Image
              src="/placeholder-property.jpg"
              alt="Property"
              fill
              className="object-cover"
            />
          </div>

          {/* Property Details */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-300">
                Adashè Estate — Plot 24
              </p>

              <Link
                href="/dashboard/properties"
                className="text-lg font-bold text-navy-950 hover:text-gold-600">
                Premium Residential Plot
              </Link>
            </div>

            {/* Payment Progress UI */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Payment progress</span>

                <span className="font-semibold text-navy-950">50%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-navy-100">
                <div className="h-full w-1/2 rounded-full bg-gold-500" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-400">₦2,500,000 paid</span>

                <span className="text-ink-400">₦5,000,000 total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application + Inspection */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Land Application */}
        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-navy-950">
              <FileText className="h-4 w-4 text-gold-600" />
              Land Application
            </h3>

            <Link
              href="/dashboard/applications"
              className="text-xs font-semibold text-navy-700 hover:text-gold-600">
              View details
            </Link>
          </div>

          <p className="mt-3 text-sm text-ink-500">Current stage</p>

          <p className="text-lg font-bold text-navy-950">Documentation</p>
        </div>

        {/* Upcoming Inspection */}
        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-navy-950">
              <CalendarCheck className="h-4 w-4 text-gold-600" />
              Upcoming Inspection
            </h3>

            <Link
              href="/dashboard/inspections"
              className="text-xs font-semibold text-navy-700 hover:text-gold-600">
              View all
            </Link>
          </div>

          <div className="mt-3">
            <p className="text-sm text-ink-500">
              September 15, 2026 at 10:00 AM
            </p>

            <p className="mt-1 text-lg font-bold text-navy-950">
              Adashè Estate
            </p>

            <Badge tone={statusToTone("Confirmed")}>Confirmed</Badge>
          </div>
        </div>
      </div>

      {/* Properties Link */}
      <Link
        href="/dashboard/properties"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-gold-600">
        View all my properties
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
