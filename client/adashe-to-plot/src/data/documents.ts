import type { CustomerDocument } from "@/types/document";

export const documents: CustomerDocument[] = [
  { id: "doc-001", name: "Contract of Sale", propertyId: "thrive-3bed-penthouse", status: "Available", dateIssued: "2026-01-15" },
  { id: "doc-002", name: "Payment Receipt — Installment 1", propertyId: "thrive-3bed-penthouse", status: "Available", dateIssued: "2026-01-05" },
  { id: "doc-003", name: "Survey Plan", propertyId: "thrive-3bed-penthouse", status: "Processing" },
  { id: "doc-004", name: "Allocation Letter", propertyId: "thrive-3bed-penthouse", status: "Pending" },
  { id: "doc-005", name: "Deed of Assignment", propertyId: "thrive-3bed-penthouse", status: "Pending" },
];

export async function getDocuments(): Promise<CustomerDocument[]> {
  return documents;
}

export async function getDocumentsByPropertyId(propertyId: string): Promise<CustomerDocument[]> {
  return documents.filter((d) => d.propertyId === propertyId);
}
