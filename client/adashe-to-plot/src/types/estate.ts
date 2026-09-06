export type DevelopmentStatus = "Ongoing" | "Completed" | "Selling Fast";

export interface EstateFeature {
  label: string;
}

export interface Estate {
  id: string;
  slug: string;
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
  propertyIds: string[];
  paymentPlanMonths: number[];
}
