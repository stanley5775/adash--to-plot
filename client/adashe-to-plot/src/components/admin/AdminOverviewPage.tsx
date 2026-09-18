
"use client";

import {
  Building2,
  Home,
  Users,
  Star,
  Wallet,
  CircleDollarSign,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGetAdminDashboardStats } from "../../../hook/admin";

export default function AdminOverviewPage() {
  const { data, isLoading, isError } = useGetAdminDashboardStats();

  const stats = data?.data;

  console.log("stats", stats);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div>
          <div className="h-7 w-40 animate-pulse rounded-lg bg-navy-50" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-navy-50" />
        </div>

        {/* Statistics Skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="h-[116px] animate-pulse rounded-2xl border border-navy-800/5 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                {/* Icon */}
                <div className="h-9 w-9 rounded-xl bg-navy-50" />

                {/* Small top-right placeholder */}
                <div className="h-4 w-8 rounded bg-navy-50" />
              </div>

              {/* Label */}
              <div className="mt-4 h-3.5 w-24 rounded bg-navy-50" />

              {/* Value */}
              <div className="mt-2 h-6 w-20 rounded bg-navy-50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">
            Admin Overview
          </h1>

          <p className="mt-1 text-sm text-ink-500">
            A snapshot across every estate, customer and sale.
          </p>
        </div>

        <EmptyState
          title="Unable to load dashboard"
          description="Something went wrong while loading the dashboard statistics."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950">
          Admin Overview
        </h1>

        <p className="mt-1 text-sm text-ink-500">
          A snapshot across every estate, customer and sale.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Total Estates"
          value={String(stats.totalEstates ?? 0)}
          icon={<Building2 className="h-4 w-4" />}
        />

        <StatCard
          label="Total Properties"
          value={String(stats.totalProperties ?? 0)}
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Available Plots"
          value={String(stats.availablePlots ?? 0)}
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Reserved Plots"
          value={String(stats.reservedPlots ?? 0)}
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Sold Plots"
          value={String(stats.soldPlots ?? 0)}
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Total Customers"
          value={String(stats.totalCustomers ?? 0)}
          icon={<Users className="h-4 w-4" />}
        />

        <StatCard
          label="ATI Plus Members"
          value={String(stats.atiPlusMembers ?? 0)}
          icon={<Star className="h-4 w-4" />}
          tone="gold"
        />

        <StatCard
          label="Total Sales"
          value={formatNaira(Number(stats.totalSales ?? 0))}
          icon={<CircleDollarSign className="h-4 w-4" />}
          tone="gold"
        />

        <StatCard
          label="Outstanding Payments"
          value={formatNaira(
            Number(stats.outstandingPayments ?? 0),
          )}
          icon={<Wallet className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

