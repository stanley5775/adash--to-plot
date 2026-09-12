import { inspections } from "@/data/inspections";
import type { Inspection } from "@/types/inspection";

export async function getInspections(): Promise<Inspection[]> {
  return inspections;
}

export async function getInspectionsByCustomerName(name: string): Promise<Inspection[]> {
  return inspections.filter((i) => i.customerName === name);
}
