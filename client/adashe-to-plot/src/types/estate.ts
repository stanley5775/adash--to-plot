export type DevelopmentStatus = "Ongoing" | "Completed" | "Selling Fast";

export interface EstateFeature {
  label: string;
}

export interface Landmark {
  name: string;
  distance: string;
}

export interface Estate {
  estateNameId: string;
  slug: string;
  city: string;
  name: string;
  location: string;
  state: string;
  summary: string;
  description: string;
  startingPrice: number;
  totalPlots: number;
  availablePlots: number;
  reservedPlots: number;
  soldPlots: number;
  developmentStatus: DevelopmentStatus;
  coverImage: string;
  gallery: string[];
  features: string[];
  nearbyLandmarks: Landmark[];
  propertyIds: string[];
  paymentPlanMonths: number[];
}
