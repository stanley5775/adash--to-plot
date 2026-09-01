import { sales } from "@/data/sales";
import type { Sale } from "@/types/sale";

export async function getSales(): Promise<Sale[]> {
  return sales;
}

export async function getSaleByCustomerId(customerId: string): Promise<Sale | undefined> {
  return sales.find((s) => s.customerId === customerId);
}
