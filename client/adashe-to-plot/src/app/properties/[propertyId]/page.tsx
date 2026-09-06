import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Ruler, FileCheck, FileClock, FileText, ChevronRight, CheckCircle2 } from "lucide-react";
import { getPropertyBySlug } from "@/services/property.service";
import { getPaymentPlanForEstate } from "@/services/payment-plan.service";
import { estates } from "@/data/estates";
import { EstateGallery } from "@/components/estate/EstateGallery";
import { PropertyStatus } from "@/components/property/PropertyStatus";
import { PaymentPlansSection } from "@/components/property/PaymentPlansSection";
import { BookInspectionButton } from "@/components/booking/BookInspectionButton";
import { InterestButton } from "@/components/booking/InterestButton";
import { WhatsAppButton } from "@/components/booking/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/payment";

function getDocEntries(doc: { surveyPlan: boolean; deedOfAssignment: boolean; allocation: boolean; contractOfSale: boolean }) {
  return [
    { label: "Survey Plan", available: doc.surveyPlan },
    { label: "Deed of Assignment", available: doc.deedOfAssignment },
    { label: "Allocation", available: doc.allocation },
    { label: "Contract of Sale", available: doc.contractOfSale },
  ];
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
  const property = await getPropertyBySlug(propertyId);
  if (!property) notFound();

  const estate = estates.find((e) => e.slug === property.estateId);
  const plan = await getPaymentPlanForEstate(property.estateId);
  const docs = getDocEntries(property.documentation);

  return (
    <div className="container-page py-10 sm:py-14">
      <nav className="flex items-center gap-1.5 text-xs text-ink-500">
        <Link href="/estates" className="hover:text-navy-900">Estates</Link>
        <ChevronRight className="h-3 w-3" />
        {estate && (
          <>
            <Link href={`/estates/${estate.slug}`} className="hover:text-navy-900">{estate.name}</Link>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="text-ink-700">{property.title}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PropertyStatus status={property.status} />
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">Plot {property.plotNumber}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-ink-500">
            <MapPin className="h-4 w-4" /> {property.location}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-300">Price</p>
          <p className="text-3xl font-bold text-navy-950">{formatNaira(property.price)}</p>
        </div>
      </div>

      <div className="mt-8">
        <EstateGallery images={property.images} name={property.title} />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoStat label="Property Type" value={property.propertyType} />
            <InfoStat label="Plot Size" value={`${property.sizeSqm}sqm`} />
            <InfoStat label="Estate" value={estate?.name ?? "—"} />
            <InfoStat label="Development" value={property.developmentStatus} />
          </div>

          <h2 className="mt-10 text-xl font-bold text-navy-950">Investment Overview</h2>
          <p className="mt-4 leading-relaxed text-ink-700">{property.description}</p>
          <ul className="mt-5 space-y-3">
            {property.investmentHighlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-ink-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" /> {h}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 text-lg font-bold text-navy-950">Property Features</h3>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {property.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-ink-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-600" /> {f}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 text-lg font-bold text-navy-950">Documentation</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {docs.map((d) => (
              <div key={d.label} className="flex items-center justify-between rounded-xl border border-navy-800/10 bg-white px-4 py-3 text-sm">
                <span className="flex items-center gap-2 text-ink-700">
                  {d.available ? <FileCheck className="h-4 w-4 text-status-available" /> : <FileClock className="h-4 w-4 text-status-reserved" />}
                  {d.label}
                </span>
                <span className={`text-xs font-semibold ${d.available ? "text-status-available" : "text-status-reserved"}`}>
                  {d.available ? "Ready" : "In Progress"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
            <h3 className="text-base font-bold text-navy-950">Ready to move forward?</h3>
            <div className="mt-4 flex flex-col gap-3">
              <BookInspectionButton propertyTitle={property.title} className="w-full" />
              <WhatsAppButton
                message={`Hello Adashè-to-Plot, I'm interested in ${property.title} (Plot ${property.plotNumber}) at ${estate?.name ?? property.location}.`}
                className="w-full"
              />
              <InterestButton propertyTitle={property.title} />
              <Button href="/application" variant="outline" className="w-full">
                <FileText className="h-4 w-4" /> Start a Land Application
              </Button>
            </div>
          </div>
        </div>
      </div>

      {plan && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-navy-950">Payment Plans for {property.title}</h2>
          <p className="mt-2 text-ink-500">Choose the plan that fits — every figure below is calculated for this exact property.</p>
          <div className="mt-6">
            <PaymentPlansSection price={property.price} rates={plan.rates.filter((r) => property.paymentPlanMonths.includes(r.duration))} />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-800/10 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-ink-300">{label}</p>
      <p className="mt-1 font-semibold text-navy-950">{value}</p>
    </div>
  );
}
