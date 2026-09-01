import { notFound } from "next/navigation";
import { MapPin, CheckCircle2 } from "lucide-react";
import { getEstateBySlug } from "@/services/estate.service";
import { getPropertiesByEstateId } from "@/services/property.service";
import { getPaymentPlanForEstate } from "@/services/payment-plan.service";
import { EstateGallery } from "@/components/estate/EstateGallery";
import { EstateStats } from "@/components/estate/EstateStats";
import { PlotMap } from "@/components/estate/PlotMap";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PaymentPlansSection } from "@/components/property/PaymentPlansSection";
import { BookInspectionButton } from "@/components/booking/BookInspectionButton";
import { WhatsAppButton } from "@/components/booking/WhatsAppButton";
import { Badge } from "@/components/ui/Badge";

export default async function EstateDetailsPage({ params }: { params: Promise<{ estateId: string }> }) {
  const { estateId } = await params;
  const estate = await getEstateBySlug(estateId);
  if (!estate) notFound();

  const properties = await getPropertiesByEstateId(estate.id);
  const plan = await getPaymentPlanForEstate(estate.id);

  return (
    <div>
      <div className="container-page py-10 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge tone={estate.developmentStatus === "Selling Fast" ? "gold" : "info"}>{estate.developmentStatus}</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">{estate.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-ink-500">
              <MapPin className="h-4 w-4" /> {estate.location}, {estate.state}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <BookInspectionButton />
            <WhatsAppButton
              message={`Hello Adashè-to-Plot, I'm interested in ${estate.name} and would like more information.`}
            />
          </div>
        </div>

        <div className="mt-8">
          <EstateGallery images={estate.gallery} name={estate.name} />
        </div>

        <div className="mt-10">
          <EstateStats estate={estate} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-navy-950">About {estate.name}</h2>
            <p className="mt-4 leading-relaxed text-ink-700">{estate.description}</p>

            <h3 className="mt-10 text-lg font-bold text-navy-950">Estate Features</h3>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {estate.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-600" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy-950">Location &amp; Landmarks</h3>
            <ul className="mt-4 space-y-3">
              {estate.landmarks.map((l) => (
                <li key={l.name} className="flex items-center justify-between rounded-xl border border-navy-800/10 bg-white px-4 py-3 text-sm">
                  <span className="text-ink-700">{l.name}</span>
                  <span className="font-semibold text-navy-950">{l.distance}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div id="plots" className="mt-16 scroll-mt-24">
          <h2 className="text-xl font-bold text-navy-950">Available Plots</h2>
          <p className="mt-2 text-ink-500">{properties.length} property types currently offered at {estate.name}.</p>
          <div className="mt-6">
            <PropertyGrid properties={properties} estateName={estate.name} />
          </div>
        </div>

        <div className="mt-16">
          <PlotMap estate={estate} />
        </div>

        {plan && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-navy-950">Payment Plans at {estate.name}</h2>
            <p className="mt-2 text-ink-500">
              Rates shown are illustrated on the estate&apos;s starting price of ₦{estate.startingPrice.toLocaleString("en-NG")}. Exact figures are calculated per property on its details page.
            </p>
            <div className="mt-6">
              <PaymentPlansSection price={estate.startingPrice} rates={plan.rates} />
            </div>
          </div>
        )}

        <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-navy-950 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-white">Ready to see {estate.name} in person?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <BookInspectionButton size="lg" />
            <WhatsAppButton
              message={`Hello Adashè-to-Plot, I'm interested in ${estate.name} and would like more information.`}
              size="lg"
            />
            <a
              href="#plots"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:border-white/40"
            >
              View Available Plots
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
