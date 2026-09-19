"use client";

import { MapPin, CheckCircle2 } from "lucide-react";

import type { Estate } from "@/types/estate";
import { useGetPropertiesUsersById } from "../../../hook/estates";

import { EstateGallery } from "@/components/estate/EstateGallery";
import { EstateStats } from "@/components/estate/EstateStats";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PaymentPlansSection } from "@/components/property/PaymentPlansSection";

import { WhatsAppButton } from "@/components/booking/WhatsAppButton";
import { Badge } from "@/components/ui/Badge";

type PropertyDetailsProps = {
  property: any;
  estateName: string;
};

export default function PropertyDetails({
  property,
  estateName,
}: PropertyDetailsProps) {
  const gallery = [
    property.images?.mainImgUrl,
    property.images?.image1Url,
    property.images?.image2Url,
    property.images?.image3Url,
    property.images?.image4Url,
  ].filter(Boolean);

  const paymentPlans = property.paymentPlans ?? [];

  return (
    <div>
      <div className="container-page py-10 sm:py-14">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge tone={property.status === "ACTIVE" ? "gold" : "info"}>
              {property.status === "ACTIVE" ? "Available" : "Coming Soon"}
            </Badge>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              {estateName}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-ink-500">
              <MapPin className="h-4 w-4" />
              {property.location}, {property.state}
            </p>
          </div>

          <WhatsAppButton
            message={`Hello Adashè-to-Plot, I'm interested in ${estateName} and would like more information.`}
          />
        </div>

        {/* GALLERY */}
        <div className="mt-8">
          <EstateGallery images={gallery} name={estateName} />
        </div>

        {/* STATS */}
        <div className="mt-10">
          <EstateStats estate={property} />
        </div>

        {/* ABOUT */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-navy-950">
              About {estateName}
            </h2>

            <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-700">
              {property.description}
            </p>

            <h3 className="mt-10 text-lg font-bold text-navy-950">
              Estate Features
            </h3>

            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(property.features ?? []).map((feature: string) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-ink-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-600" />

                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AVAILABLE PLOTS */}
        <div id="plots" className="mt-16 scroll-mt-24">
          <h2 className="text-xl font-bold text-navy-950">Available Plots</h2>

          <p className="mt-2 text-ink-500">
            {property.totalPlots} plots currently offered at {estateName}.
          </p>
        </div>

        {/* PAYMENT PLANS */}
        {paymentPlans.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-navy-950">
              Payment Plans at {estateName}
            </h2>

            <p className="mt-2 text-ink-500">
              Choose a payment plan for this property.
            </p>

            <div className="mt-6">
              <PaymentPlansSection
                propertyId={property.id}
                price={Number(property.startingPrice)}
                rates={paymentPlans}
                estate={property.estate}
                propertyLocation={property.location}
                propertyCity={property.city}
                propertyState={property.state}
                isAuthenticated={property.isAuthenticated}
                isAtiMember={property.isAtiMember}
                isApplication={property.isApplication}
                canPurchase={property.canPurchase}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-navy-950 px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-white">
            Ready to see {estateName} in person?
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            <WhatsAppButton
              message={`Hello Adashè-to-Plot, I'm interested in ${estateName} and would like more information.`}
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
