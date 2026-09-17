"use client";

import Image from "next/image";
import Link from "next/link";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useGetMyProperties } from "../../../../hook/users";

export default function MyPropertiesPage() {
  const { data, isLoading, isError } = useGetMyProperties();

  const properties = data?.data?.properties ?? [];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <DashboardHeader
          title="My Properties"
          subtitle="Every property associated with your account."
        />

        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <DashboardHeader
          title="My Properties"
          subtitle="Every property associated with your account."
        />

        <EmptyState
          title="Unable to load properties"
          description="Something went wrong while loading your properties."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="My Properties"
        subtitle="Every property associated with your account."
      />

      {properties.length === 0 ? (
        <EmptyState
          title="No properties yet"
          description="You do not have any active property purchases yet."
        />
      ) : (
        <div className="space-y-5">
          {properties.map((purchase: any) => {
            const totalAmount = Number(purchase.paymentPlan?.totalAmount ?? 0);

            const amountPaid = Number(purchase.amountPaid ?? 0);

            const balance = Number(purchase.balance ?? 0);

            const progress =
              totalAmount > 0
                ? Math.min((amountPaid / totalAmount) * 100, 100)
                : 0;

            const statusLabel =
              purchase.status === "COMPLETED"
                ? "Completed"
                : purchase.status === "ACTIVE"
                  ? "In Progress"
                  : purchase.status === "PENDING"
                    ? "Pending"
                    : purchase.status;

            return (
              <Link
                key={purchase.id}
                href={`/properties/${purchase.propertyId}`}
                className="flex flex-col gap-5 rounded-2xl border border-navy-800/10 bg-white p-6 transition-shadow hover:shadow-lg sm:flex-row sm:items-center">
                {/* Property Image */}
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:w-56">
                  {purchase.propertyImage?.mainImage ? (
                    <Image
                      src={purchase.propertyImage.mainImage}
                      alt={
                        purchase.property?.location ??
                        purchase.estate?.name ??
                        "Property"
                      }
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-xs uppercase tracking-wide text-gold-600">
                    {purchase.estate?.name ?? "Estate"}
                    {purchase.property?.location
                      ? ` — ${purchase.property.location}`
                      : ""}
                  </p>

                  <h3 className="text-lg font-bold text-navy-950">
                    {purchase.paymentPlan?.name ?? "Property Purchase"}
                  </h3>

                  <p className="text-sm text-ink-300">
                    {purchase.property?.city}, {purchase.property?.state}
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <MiniStat
                      label="Total Price"
                      value={formatNaira(totalAmount)}
                    />

                    <MiniStat
                      label="Purchase Status"
                      value={
                        <Badge tone={statusToTone(statusLabel)}>
                          {statusLabel}
                        </Badge>
                      }
                    />

                    <MiniStat
                      label="Payment Progress"
                      value={`${Math.round(progress)}%`}
                    />

                    <MiniStat
                      label="Plan"
                      value={`${purchase.paymentPlan?.durationMonths ?? purchase.durationMonths ?? 0} Months`}
                    />
                  </div>

                  {/* Payment progress */}
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-ink-300">
                        {formatNaira(amountPaid)} paid
                      </span>

                      <span className="font-medium text-navy-950">
                        {formatNaira(balance)} balance
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-navy-800/10">
                      <div
                        className="h-full rounded-full bg-gold-500 transition-all"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
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

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(amount);
}
