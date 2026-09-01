import { Building2, Home, Users, Star, Wallet, TrendingUp, CircleDollarSign } from "lucide-react";
import { estates } from "@/data/estates";
import { properties } from "@/data/properties";
import { customers } from "@/data/customers";
import { atiMembers } from "@/data/ati-members";
import { sales } from "@/data/sales";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatNaira } from "@/lib/payment";

export default function AdminOverviewPage() {
  const totalAvailable = estates.reduce((sum, e) => sum + e.availablePlots, 0);
  const totalReserved = estates.reduce((sum, e) => sum + e.reservedPlots, 0);
  const totalSold = estates.reduce((sum, e) => sum + e.soldPlots, 0);
  const totalPlots = totalAvailable + totalReserved + totalSold;
  const totalRevenue = sales.reduce((sum, s) => sum + s.amountPaid, 0);
  const outstanding = sales.reduce((sum, s) => sum + s.outstandingBalance, 0);

  const plotSplit = [
    { label: "Available", value: totalAvailable, color: "bg-status-available" },
    { label: "Reserved", value: totalReserved, color: "bg-status-reserved" },
    { label: "Sold", value: totalSold, color: "bg-status-sold" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Admin Overview</h1>
        <p className="mt-1 text-sm text-ink-500">A live snapshot across every estate, customer and sale.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Estates" value={String(estates.length)} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Total Properties" value={String(properties.length)} icon={<Home className="h-4 w-4" />} />
        <StatCard label="Available Plots" value={String(totalAvailable)} icon={<Home className="h-4 w-4" />} />
        <StatCard label="Reserved Plots" value={String(totalReserved)} icon={<Home className="h-4 w-4" />} />
        <StatCard label="Sold Plots" value={String(totalSold)} icon={<Home className="h-4 w-4" />} />
        <StatCard label="Total Customers" value={String(customers.length)} icon={<Users className="h-4 w-4" />} />
        <StatCard label="ATI Plus Members" value={String(atiMembers.length)} icon={<Star className="h-4 w-4" />} tone="gold" />
        <StatCard label="Total Sales" value={formatNaira(totalRevenue)} icon={<CircleDollarSign className="h-4 w-4" />} tone="gold" />
        <StatCard label="Outstanding Payments" value={formatNaira(outstanding)} icon={<Wallet className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <h3 className="flex items-center gap-2 text-base font-bold text-navy-950">
            <TrendingUp className="h-4 w-4 text-gold-600" /> Plot Status Across Estates
          </h3>
          <div className="mt-5 space-y-4">
            {plotSplit.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">{s.label}</span>
                  <span className="font-semibold text-navy-950">{s.value} of {totalPlots}</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.value / totalPlots) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <h3 className="text-base font-bold text-navy-950">Plots by Estate</h3>
          <div className="mt-5 space-y-5">
            {estates.map((e) => (
              <div key={e.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">{e.name}</span>
                  <span className="font-semibold text-navy-950">{e.availablePlots} / {e.totalPlots} available</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-navy-100">
                  <div className="h-full rounded-full bg-navy-700" style={{ width: `${(e.availablePlots / e.totalPlots) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
