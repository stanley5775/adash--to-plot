"use client";

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
import { useGetUserDashboard } from "../../../hook/users";

function UsersDashboard() {
  const { data, isLoading, isError } = useGetUserDashboard();

  const dashboard = data?.data;
  const summary = dashboard?.summary;
  const purchases = dashboard?.purchases ?? [];

  const firstPurchase = purchases.find(
    (purchase: any) =>
      purchase.status === "ACTIVE" || purchase.status === "COMPLETED",
  );

  const totalAmount = Number(firstPurchase?.paymentPlan?.totalAmount ?? 0);

  const amountPaid = Number(firstPurchase?.amountPaid ?? 0);

  const paymentProgress =
    totalAmount > 0 ? Math.min((amountPaid / totalAmount) * 100, 100) : 0;

  const formatNaira = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Payment in progress";
      case "COMPLETED":
        return "Payment completed";
      case "PENDING":
        return "Awaiting payment";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <DashboardHeader
          title="Overview"
          subtitle="A snapshot of your investment with Adashè-to-Plot."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-navy-100"
            />
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-navy-100" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <DashboardHeader
          title="Overview"
          subtitle="A snapshot of your investment with Adashè-to-Plot."
        />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          Failed to load your dashboard. Please refresh and try again.
        </div>
      </div>
    );
  }

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
          value={String(summary?.totalProperties ?? 0)}
          icon={<Home className="h-4 w-4" />}
        />

        <StatCard
          label="Total Investment"
          value={formatNaira(summary?.totalPropertyValue ?? 0)}
          icon={<Wallet className="h-4 w-4" />}
        />

        <StatCard
          label="Outstanding Balance"
          value={formatNaira(summary?.totalBalance ?? 0)}
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
      {firstPurchase ? (
        <div className="rounded-2xl border border-navy-800/10 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-bold text-navy-950">My Property</h3>

            <Badge tone={statusToTone(getStatusLabel(firstPurchase.status))}>
              {getStatusLabel(firstPurchase.status)}
            </Badge>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            {/* Property Image */}
            <div className="relative h-40 w-full overflow-hidden rounded-xl lg:h-full">
              <Image
                src={
                  firstPurchase.propertyImage?.mainImage ||
                  "/placeholder-property.jpg"
                }
                alt={firstPurchase.property?.location ?? "Property"}
                fill
                className="object-cover"
              />
            </div>

            {/* Property Details */}
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">
                  {firstPurchase.estate?.name ?? "Estate"}
                  {firstPurchase.property?.location
                    ? ` — ${firstPurchase.property.location}`
                    : ""}
                </p>

                <Link
                  href={`/dashboard/properties/${firstPurchase.propertyId}`}
                  className="text-lg font-bold text-navy-950 hover:text-gold-600">
                  {firstPurchase.paymentPlan?.name ?? "Property Purchase"}
                </Link>

                {(firstPurchase.property?.city ||
                  firstPurchase.property?.state) && (
                  <p className="mt-1 text-sm text-ink-400">
                    {[firstPurchase.property.city, firstPurchase.property.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>

              {/* Payment Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-500">Payment progress</span>

                  <span className="font-semibold text-navy-950">
                    {Math.round(paymentProgress)}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-navy-100">
                  <div
                    className="h-full rounded-full bg-gold-500 transition-all"
                    style={{
                      width: `${paymentProgress}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-400">
                    {formatNaira(amountPaid)} paid
                  </span>

                  <span className="text-ink-400">
                    {formatNaira(totalAmount)} total
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-navy-800/10 bg-white p-8 text-center">
          <Home className="mx-auto h-8 w-8 text-ink-300" />

          <h3 className="mt-3 font-bold text-navy-950">
            No purchased properties yet
          </h3>

          <p className="mt-1 text-sm text-ink-500">
            Your property purchases will appear here.
          </p>

          <Link
            href="/estates"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-gold-600">
            Browse properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default UsersDashboard;
