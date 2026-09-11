import {
  Building2,
  Home,
  Users,
  Star,
  Wallet,
  TrendingUp,
  CircleDollarSign,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";

export default function AdminOverviewPage() {
  const plotSplit = [
    {
      label: "Available",
      value: 128,
      total: 250,
      color: "bg-status-available",
    },
    {
      label: "Reserved",
      value: 42,
      total: 250,
      color: "bg-status-reserved",
    },
    {
      label: "Sold",
      value: 80,
      total: 250,
      color: "bg-status-sold",
    },
  ];

  const estates = [
    {
      id: 1,
      name: "Adashè Estate",
      availablePlots: 48,
      totalPlots: 100,
    },
    {
      id: 2,
      name: "Thrive Estate",
      availablePlots: 32,
      totalPlots: 75,
    },
    {
      id: 3,
      name: "AMIO Vista Homes",
      availablePlots: 48,
      totalPlots: 75,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Admin Overview</h1>

        <p className="mt-1 text-sm text-ink-500">
          A snapshot across every estate, customer and sale.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Total Estates"
          value="12"
          icon={<Building2 className="h-4 w-4" />}
        />

        <StatCard
          label="Total Properties"
          value="250"
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Available Plots"
          value="128"
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Reserved Plots"
          value="42"
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Sold Plots"
          value="80"
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Total Customers"
          value="184"
          icon={<Users className="h-4 w-4" />}
        />

        <StatCard
          label="ATI Plus Members"
          value="76"
          icon={<Star className="h-4 w-4" />}
          tone="gold"
        />

        <StatCard
          label="Total Sales"
          value="₦185,400,000"
          icon={<CircleDollarSign className="h-4 w-4" />}
          tone="gold"
        />

        <StatCard
          label="Outstanding Payments"
          value="₦42,850,000"
          icon={<Wallet className="h-4 w-4" />}
        />
      </div>

      {/* Charts / Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Plot Status */}
        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-navy-950">
            <TrendingUp className="h-4 w-4 text-gold-600" />
            Plot Status Across Estates
          </h3>

          <div className="mt-5 space-y-4">
            {plotSplit.map((plot) => (
              <div key={plot.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">{plot.label}</span>

                  <span className="font-semibold text-navy-950">
                    {plot.value} of {plot.total}
                  </span>
                </div>

                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
                  <div
                    className={`h-full rounded-full ${plot.color}`}
                    style={{
                      width: `${(plot.value / plot.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plots By Estate */}
        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <h3 className="text-base font-bold text-navy-950">Plots by Estate</h3>

          <div className="mt-5 space-y-5">
            {estates.map((estate) => (
              <div key={estate.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">{estate.name}</span>

                  <span className="font-semibold text-navy-950">
                    {estate.availablePlots} / {estate.totalPlots} available
                  </span>
                </div>

                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
                  <div
                    className="h-full rounded-full bg-navy-700"
                    style={{
                      width: `${
                        (estate.availablePlots / estate.totalPlots) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
