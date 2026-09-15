export enum PropertyStatus {
  ACTIVE = "ACTIVE",
  NON_ACTIVE = "NON_ACTIVE",
  SOLD_OUT = "SOLD_OUT",
}

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
