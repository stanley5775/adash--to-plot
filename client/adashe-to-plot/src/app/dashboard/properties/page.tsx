import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/services/customer.service";
import { getSaleByCustomerId } from "@/services/sale.service";
import { getPropertyBySlug } from "@/services/property.service";
import { estates } from "@/data/estates";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNaira } from "@/lib/payment";
import { Home } from "lucide-react";

export default async function MyPropertiesPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login?redirect=/dashboard/properties");
  }

  const sale = await getSaleByCustomerId(customer.id);
  const property = sale ? await getPropertyBySlug(sale.propertyId) : undefined;
  const estate = estates.find((e) => e.id === customer.estateId);

  return (
    <div className="space-y-8">
      <DashboardHeader customer={customer} title="My Properties" subtitle="Every property associated with your account." />

      {property && sale && estate ? (
        <Link
          href={`/dashboard/properties/${property.slug}`}
          className="flex flex-col gap-5 rounded-2xl border border-navy-800/10 bg-white p-6 transition-shadow hover:shadow-lg sm:flex-row sm:items-center"
        >
          <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:w-56">
            <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-xs uppercase tracking-wide text-gold-600">{estate.name} — Plot {property.plotNumber}</p>
            <h3 className="text-lg font-bold text-navy-950">{property.title}</h3>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MiniStat label="Price" value={formatNaira(property.price)} />
              <MiniStat label="Purchase Status" value={<Badge tone={statusToTone(sale.salesStatus)}>{sale.salesStatus}</Badge>} />
              <MiniStat label="Payment Progress" value={`${Math.round((sale.amountPaid / sale.totalPayable) * 100)}%`} />
              <MiniStat label="Plan" value={sale.planDuration === 0 ? "Outright" : `${sale.planDuration} Months`} />
            </div>
          </div>
        </Link>
      ) : (
        <EmptyState
          title="No properties yet"
          description="Once you purchase or reserve a property, it will appear here."
          icon={<Home className="h-8 w-8" />}
        />
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
