import { estates } from "@/data/estates";
import type { Estate } from "@/types/estate";

export async function getEstates(): Promise<Estate[]> {
  return estates;
}

export async function getEstateBySlug(slug: string): Promise<Estate | undefined> {
  return estates.find((e) => e.slug === slug);
}
