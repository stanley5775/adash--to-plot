import { documents } from "@/data/documents";
import type { CustomerDocument } from "@/types/document";

export async function getDocuments(): Promise<CustomerDocument[]> {
  return documents;
}

export async function getDocumentsByPropertyId(propertyId: string): Promise<CustomerDocument[]> {
  return documents.filter((d) => d.propertyId === propertyId);
}
