import type { Estate } from "@/types/estate";

export const estates: Estate[] = [
  {
    id: "thrive-estate",
    slug: "thrive-estate",
    name: "The Thrive Estate",
    location: "Kuje, Abuja",
    state: "FCT",
    summary:
      "A master-planned residential estate in Kuje offering six home types from entry-level terraces to income-generating blocks of flats.",
    description:
      "The Thrive Estate is a secured, master-planned residential development in Kuje, Abuja, designed to give every kind of investor a way in — from first-time owners starting with a 2 bedroom terrace, to institutional investors acquiring a full block of 6 rentable flats. The estate sits within reach of the Kuje-Gwagwalada corridor, one of the FCT's fastest-growing residential axes, and is being developed in phases with road network, drainage, and perimeter security already underway.",
    startingPrice: 1500000,
    totalPlots: 120,
    availablePlots: 74,
    reservedPlots: 12,
    soldPlots: 34,
    developmentStatus: "Ongoing",
    coverImage: "/images/thrive-4bed-semi-detached.jpg",
    gallery: [
      "/images/thrive-4bed-semi-detached.jpg",
      "/images/thrive-3bed-penthouse.jpg",
      "/images/thrive-3bed-terrace.jpg",
      "/images/thrive-fully-detached.jpg",
      "/images/thrive-2bed-terrace.jpg",
      "/images/thrive-6unit-flats.jpg",
    ],
    features: [
      "Good internal road network",
      "24-hour perimeter security",
      "Prepaid electricity metering",
      "Borehole water supply",
      "Engineered drainage system",
      "Fenced estate perimeter",
    ],
    landmarks: [
      { name: "Kuje-Gwagwalada Expressway", distance: "4 minutes" },
      { name: "Kuje Central Market", distance: "10 minutes" },
      { name: "Nizamiye Turkish Hospital", distance: "18 minutes" },
      { name: "Kuje General Hospital", distance: "12 minutes" },
    ],
    propertyIds: [
      "thrive-2bed-terrace",
      "thrive-3bed-terrace",
      "thrive-3bed-penthouse",
      "thrive-4bed-semi-detached",
      "thrive-fully-detached",
      "thrive-6unit-flats",
    ],
    paymentPlanMonths: [0, 6, 12, 18, 24],
  },
  {
    id: "amio-vista-homes",
    slug: "amio-vista-homes",
    name: "AMIO Vista Homes",
    location: "Kuje, Abuja",
    state: "FCT",
    summary:
      "A boutique, low-density estate in Kuje offering distinctive bungalow-with-penthouse homes on an outright or fast 6-month plan.",
    description:
      "AMIO Vista Homes is a boutique residential enclave in Kuje, Abuja, built around a signature bungalow-with-penthouse design that gives owners ground-floor living with an elevated private retreat above. The estate is intentionally low-density, with a limited plot count, and is positioned for buyers who want to move quickly — every home here is available outright or on a fast-track 6-month plan at 0% interest.",
    startingPrice: 3000000,
    totalPlots: 40,
    availablePlots: 27,
    reservedPlots: 5,
    soldPlots: 8,
    developmentStatus: "Selling Fast",
    coverImage: "/images/amio-2bed-bungalow.jpg",
    gallery: ["/images/amio-2bed-bungalow.jpg", "/images/amio-3bed-bungalow.jpg"],
    features: [
      "Low-density, gated layout",
      "Borehole water supply",
      "Perimeter fencing",
      "Graded internal access roads",
      "Estate security post",
    ],
    landmarks: [
      { name: "Kuje-Gwagwalada Expressway", distance: "7 minutes" },
      { name: "Kuje Central Market", distance: "13 minutes" },
      { name: "Kuje General Hospital", distance: "15 minutes" },
    ],
    propertyIds: ["amio-2bed-bungalow", "amio-3bed-bungalow"],
    paymentPlanMonths: [0, 6],
  },
];

export async function getEstates(): Promise<Estate[]> {
  return estates;
}

export async function getEstateBySlug(slug: string): Promise<Estate | undefined> {
  return estates.find((e) => e.slug === slug);
}
