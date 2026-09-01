export type PropertyStatus = "Available" | "Reserved" | "Sold";

export interface PropertyDocumentation {
  surveyPlan: boolean;
  deedOfAssignment: boolean;
  allocation: boolean;
  contractOfSale: boolean;
}

export interface Property {
  id: string;
  slug: string;
  estateId: string;
  plotNumber: string;
  title: string;
  propertyType: string;
  location: string;
  sizeSqm: number;
  price: number;
  status: PropertyStatus;
  developmentStatus: string;
  images: string[];
  description: string;
  investmentHighlights: string[];
  features: string[];
  documentation: PropertyDocumentation;
  paymentPlanMonths: number[];
}
