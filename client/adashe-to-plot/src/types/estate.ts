export type DevelopmentStatus = "Ongoing" | "Completed" | "Selling Fast";

export interface EstateFeature {
  label: string;
}

export interface Landmark {
  name: string;
  distance: string;
}

export type Estate = {
  id: string;
  estateName: string;
  state: string;
  city: string;
  location: string;
  description: string;
  startingPrice: string;
  totalPlots: number;
  mainImage: string | null;
};
