import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Home, Wallet, Star, FileText, CalendarCheck, ArrowRight } from "lucide-react";
import { getCurrentCustomer } from "@/services/customer.service";
import { getSaleByCustomerId } from "@/services/sale.service";
import { getPropertyBySlug } from "@/services/property.service";
import { getPaymentPlanForEstate } from "@/services/payment-plan.service";
import { getApplicationByCustomerEmail } from "@/services/application.service";
import { getInspectionsByCustomerName } from "@/services/inspection.service";
import { estates } from "@/data/estates";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { PaymentProgress } from "@/components/dashboard/PaymentProgress";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { formatNaira, formatDate } from "@/lib/payment";

export default async function DashboardOverviewPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login?redirect=/dashboard");
  }

  const sale = await getSaleByCustomerId(customer.id);
  
  const property = sale ? await getPropertyBySlug(sale.propertyId) : undefined;
  const estate = estates.find((e) => e.id === customer.estateId);
  const plan = await getPaymentPlanForEstate(customer.estateId);
  const rate = plan?.rates.find((r) => r.duration === sale?.planDuration);
  const application = await getApplicationByCustomerEmail(customer.email);
  const inspections = await getInspectionsByCustomerName(customer.name);
  const upcomingInspection = inspections.find((i) => i.status === "Confirmed" || i.status === "Pending");

  return (
    <div className="space-y-8">
      <DashboardHeader customer={customer} title="Overview" subtitle="A snapshot of your investment with Adashè-to-Plot." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Properties" value="1" icon={<Home className="h-4 w-4" />} />
        <StatCard label="Total Investment" value={sale ? formatNaira(sale.totalPayable) : "—"} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label="Outstanding Balance" value={sale ? formatNaira(sale.outstandingBalance) : "—"} icon={<Wallet className="h-4 w-4" />} tone="gold" />
        <StatCard label="ATI Plus Status" value={customer.isAtiPlusMember ? "Active Member" : "Not a Member"} icon={<Star className="h-4 w-4" />} />
      </div>

      {property && sale && estate && (
        <div className="rounded-2xl border border-navy-800/10 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-bold text-navy-950">My Property</h3>
            <Badge tone={statusToTone(sale.salesStatus === "Completed" ? "Completed" : "In Progress")}>
              {sale.salesStatus === "Completed" ? "Fully Paid" : "Payment in progress"}
            </Badge>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            <div className="relative h-40 w-full overflow-hidden rounded-xl lg:h-full">
              <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">{estate.name} — Plot {property.plotNumber}</p>
                <Link href={`/dashboard/properties/${property.slug}`} className="text-lg font-bold text-navy-950 hover:text-gold-600">
                  {property.title}
                </Link>
              </div>
              {rate && <PaymentProgress sale={sale} rate={rate} isAtiPlusMember={customer.isAtiPlusMember} />}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {application && (
          <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-navy-950">
                <FileText className="h-4 w-4 text-gold-600" /> Land Application
              </h3>
              <Link href="/dashboard/applications" className="text-xs font-semibold text-navy-700 hover:text-gold-600">View details</Link>
            </div>
            <p className="mt-3 text-sm text-ink-500">Current stage</p>
            <p className="text-lg font-bold text-navy-950">{application.currentStage}</p>
          </div>
        )}

        <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-navy-950">
              <CalendarCheck className="h-4 w-4 text-gold-600" /> Upcoming Inspection
            </h3>
            <Link href="/dashboard/inspections" className="text-xs font-semibold text-navy-700 hover:text-gold-600">View all</Link>
          </div>
          {upcomingInspection ? (
            <div className="mt-3">
              <p className="text-sm text-ink-500">{formatDate(upcomingInspection.date)} at {upcomingInspection.time}</p>
              <p className="mt-1 text-lg font-bold text-navy-950">{estate?.name}</p>
              <Badge tone={statusToTone(upcomingInspection.status)}>{upcomingInspection.status}</Badge>
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink-500">No inspections scheduled.</p>
          )}
        </div>
      </div>

      <Link
        href="/dashboard/properties"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-gold-600"
      >
        View all my properties <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
