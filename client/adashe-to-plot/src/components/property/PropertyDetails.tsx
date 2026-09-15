"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Ruler,
  FileCheck,
  FileClock,
  FileText,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { formatNaira } from "@/lib/payment";

type PropertyDocument = {
  surveyPlan: boolean;
  deedOfAssignment: boolean;
  allocation: boolean;
  contractOfSale: boolean;
};

type Property = {
  id: string;
  name?: string | null;
  title?: string | null;
  description?: string | null;

  location?: string | null;
  city?: string | null;
  state?: string | null;

  size?: string | null;
  plotSize?: string | null;

  price?: string | number | null;
  startingPrice?: string | number | null;

  status?: string | null;

  mainImage?: string | null;
  mainImageUrl?: string | null;

  images?: string[];
  galleryImages?: string[];

  documents?: PropertyDocument;

  features?: string[];
  nearbyLandmarks?: string[];
};

type PropertyDetailsProps = {
  property: Property;
  estateName?: string;
};

function getDocEntries(doc?: PropertyDocument) {
  return [
    {
      label: "Survey Plan",
      available: doc?.surveyPlan ?? false,
    },
    {
      label: "Deed of Assignment",
      available: doc?.deedOfAssignment ?? false,
    },
    {
      label: "Allocation",
      available: doc?.allocation ?? false,
    },
    {
      label: "Contract of Sale",
      available: doc?.contractOfSale ?? false,
    },
  ];
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-navy-800/10 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-ink-300">{label}</p>

      <p className="mt-1 font-semibold text-navy-950">{value}</p>
    </div>
  );
}

export default function PropertyDetails({
  property,
  estateName,
}: PropertyDetailsProps) {
  const title = property.name ?? property.title ?? "Property";

  const price = property.price ?? property.startingPrice;

  const image = property.mainImage ?? property.mainImageUrl;

  const gallery = [
    ...(image ? [image] : []),
    ...(property.images ?? []),
    ...(property.galleryImages ?? []),
  ].filter(Boolean);

  const documents = getDocEntries(property.documents);

  return (
    <section className="bg-ink-50">
      <div className="container-page py-10 sm:py-14">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-ink-400">
          <Link href="/estates" className="transition hover:text-navy-900">
            Estates
          </Link>

          <ChevronRight className="h-4 w-4" />

          {estateName && (
            <>
              <span className="text-ink-500">{estateName}</span>

              <ChevronRight className="h-4 w-4" />
            </>
          )}

          <span className="font-medium text-navy-900">{title}</span>
        </div>

        {/* Main Property Card */}
        <div className="overflow-hidden rounded-3xl border border-navy-800/10 bg-white">
          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="grid gap-2 bg-navy-950 md:grid-cols-2">
              <div className="relative h-[320px] md:h-[500px]">
                <Image
                  src={gallery[0]}
                  alt={title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>

              {gallery.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {gallery.slice(1, 5).map((imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      className="relative min-h-[150px] md:min-h-0">
                      <Image
                        src={imageUrl}
                        alt={`${title} ${index + 2}`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 25vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Property Header */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                {estateName && (
                  <p className="mb-2 text-sm font-medium text-navy-700">
                    {estateName}
                  </p>
                )}

                <h1 className="text-3xl font-bold text-navy-950 sm:text-4xl">
                  {title}
                </h1>

                {(property.location || property.city || property.state) && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-ink-500">
                    <MapPin className="h-4 w-4" />

                    {property.location ??
                      [property.city, property.state]
                        .filter(Boolean)
                        .join(", ")}
                  </p>
                )}
              </div>

              {price !== null && price !== undefined && (
                <div className="shrink-0">
                  <p className="text-xs uppercase tracking-wide text-ink-400">
                    Price
                  </p>

                  <p className="mt-1 text-2xl font-bold text-navy-950">
                    {formatNaira(Number(price))}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-navy-950">
                  About this property
                </h2>

                <p className="mt-3 max-w-4xl text-sm leading-7 text-ink-500">
                  {property.description}
                </p>
              </div>
            )}

            {/* Property Stats */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {property.size && (
                <InfoStat label="Plot Size" value={property.size} />
              )}

              {property.plotSize && !property.size && (
                <InfoStat label="Plot Size" value={property.plotSize} />
              )}

              {property.city && <InfoStat label="City" value={property.city} />}

              {property.state && (
                <InfoStat label="State" value={property.state} />
              )}

              {property.status && (
                <InfoStat label="Status" value={property.status} />
              )}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-navy-800/10 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50">
                  <FileCheck className="h-5 w-5 text-navy-700" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-navy-950">
                    Property Documentation
                  </h2>

                  <p className="text-sm text-ink-500">
                    Available documentation for this property.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {documents.map((document) => (
                  <div
                    key={document.label}
                    className="flex items-center justify-between rounded-xl border border-navy-800/10 p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-navy-700" />

                      <span className="text-sm font-medium text-navy-950">
                        {document.label}
                      </span>
                    </div>

                    {document.available ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileClock className="h-5 w-5 text-ink-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="h-fit rounded-3xl border border-navy-800/10 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-950">
              Interested in this property?
            </h2>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              Contact our team to learn more, schedule an inspection, or begin
              your application.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                className="w-full rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-900">
                Book Inspection
              </button>

              <button
                type="button"
                className="w-full rounded-xl border border-navy-800/10 px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-navy-50">
                I'm Interested
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mt-8 rounded-3xl border border-navy-800/10 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-950">
              Property Features
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {property.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-xl bg-navy-50 p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-navy-700" />

                  <span className="text-sm font-medium text-navy-950">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Landmarks */}
        {property.nearbyLandmarks && property.nearbyLandmarks.length > 0 && (
          <div className="mt-8 rounded-3xl border border-navy-800/10 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-950">
              Nearby Landmarks
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {property.nearbyLandmarks.map((landmark) => (
                <div
                  key={landmark}
                  className="flex items-center gap-3 rounded-xl border border-navy-800/10 p-4">
                  <MapPin className="h-5 w-5 shrink-0 text-navy-700" />

                  <span className="text-sm text-ink-600">{landmark}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
