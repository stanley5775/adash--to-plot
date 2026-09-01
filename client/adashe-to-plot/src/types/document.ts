export type DocumentStatus = "Available" | "Processing" | "Pending";

export interface CustomerDocument {
  id: string;
  name: string;
  propertyId: string;
  status: DocumentStatus;
  dateIssued?: string;
}
