import { notFound } from "next/navigation";
import Image from "next/image";
import { getCurrentCustomer } from "@/services/customer.service";
import { getSaleByCustomerId } from "@/services/sale.service";
import { getPropertyBySlug } from "@/services/property.service";
import { getPaymentPlanForEstate } from "@/services/payment-plan.service";
import { getApplicationByCustomerEmail } from "@/services/application.service";
import { getDocumentsByPropertyId } from "@/services/document.service";
import { estates } from "@/data/estates";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PaymentProgress } from "@/components/dashboard/PaymentProgress";
import { ApplicationTimeline } from "@/components/dashboard/ApplicationTimeline";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { formatApplicationStatus, applicationStatusTone } from "@/lib/application-status";
import { formatNaira, formatDate } from "@/lib/payment";

export default async function DashboardPropertyDetailsPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
  const customer = await getCurrentCustomer();
  const property = await getPropertyBySlug(propertyId);
  if (!property) notFound();

  const sale = await getSaleByCustomerId(customer.id);
  if (!sale || sale.propertyId !== property.id) notFound();

  const estate = estates.find((e) => e.id === property.estateId);
  const plan = await getPaymentPlanForEstate(property.estateId);
  const rate = plan?.rates.find((r) => r.duration === sale.planDuration);
  const application = await getApplicationByCustomerEmail(customer.email);
  const docs = await getDocumentsByPropertyId(property.id);

  return (
    <div className="space-y-8">
      <DashboardHeader customer={customer} title={property.title} subtitle={`${estate?.name} — Plot ${property.plotNumber}`} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="relative h-56 w-full overflow-hidden rounded-2xl lg:col-span-1">
          <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-4">
          <MiniStat label="Price" value={formatNaira(property.price)} />
          <MiniStat label="Plan" value={sale.planDuration === 0 ? "Outright" : `${sale.planDuration} Months`} />
          <MiniStat label="Purchase Status" value={<Badge tone={statusToTone(sale.salesStatus)}>{sale.salesStatus}</Badge>} />
          <MiniStat label="Application Status" value={application ? <Badge tone={applicationStatusTone(application.status)}>{formatApplicationStatus(application.status)}</Badge> : "—"} />
        </div>
      </div>

      {rate && <PaymentProgress sale={sale} rate={rate} isAtiPlusMember={customer.isAtiPlusMember} />}

      <div>
        <h3 className="text-base font-bold text-navy-950">Payment History</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-800/10 bg-navy-50">
                  <th className="px-5 py-3 font-semibold text-ink-700">Date</th>
                  <th className="px-5 py-3 font-semibold text-ink-700">Description</th>
                  <th className="px-5 py-3 font-semibold text-ink-700">Amount</th>
                  <th className="px-5 py-3 font-semibold text-ink-700">Status</th>
                  <th className="px-5 py-3 font-semibold text-ink-700">Reference</th>
                </tr>
              </thead>
              <tbody>
                {sale.paymentHistory.map((p) => (
                  <tr key={p.id} className="border-b border-navy-800/5 last:border-0">
                    <td className="px-5 py-3.5 text-ink-700">{formatDate(p.date)}</td>
                    <td className="px-5 py-3.5 text-ink-700">{p.description}</td>
                    <td className="px-5 py-3.5 font-semibold text-navy-950">{formatNaira(p.amount)}</td>
                    <td className="px-5 py-3.5"><Badge tone={statusToTone(p.status)}>{p.status}</Badge></td>
                    <td className="px-5 py-3.5 text-ink-500">{p.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {application && <ApplicationTimeline application={application} />}

      <div>
        <h3 className="text-base font-bold text-navy-950">Documents</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-navy-800/10 bg-white px-4 py-3 text-sm">
              <span className="text-ink-700">{d.name}</span>
              <Badge tone={statusToTone(d.status)}>{d.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-navy-800/10 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-ink-300">{label}</p>
      <div className="mt-1 font-semibold text-navy-950">{value}</div>
    </div>
  );
}
