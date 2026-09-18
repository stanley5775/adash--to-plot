export type Estate = {
  id: string;
  estateId: string;
  estateName: string;
  state: string;
  city: string;
  location: string;
  description: string;
  startingPrice: string;
  totalPlots: number;
  mainImage: string | null;
  status: "ACTIVE" | "INACTIVE";
};
