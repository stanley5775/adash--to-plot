export type InspectionStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Inspection {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  estateId: string;
  propertyId?: string;
  date: string;
  time: string;
  status: InspectionStatus;
}
