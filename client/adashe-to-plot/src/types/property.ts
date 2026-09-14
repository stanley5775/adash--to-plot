export interface PropertyDocumentation {
  surveyPlan: boolean;
  deedOfAssignment: boolean;
  allocation: boolean;
  contractOfSale: boolean;
}

export type PropertyStatus = "AVAILABLE" | "SOLD" | "RESERVED" | "UNAVAILABLE";

export interface Property {
  id: string;
  estateId: string;
  estateName: string;
  plotSize: string;
  state: string;
  city: string;
  location: string;

  description: string | null;

  startingPrice: string | number;

  totalPlots: number;

  status: PropertyStatus;

  mainImage: string | null;
}
