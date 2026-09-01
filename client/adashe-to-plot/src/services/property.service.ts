import { properties } from "@/data/properties";
import type { Property } from "@/types/property";

export async function getProperties(): Promise<Property[]> {
  return properties;
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  return properties.find((p) => p.slug === slug);
}

export async function getPropertiesByEstateId(estateId: string): Promise<Property[]> {
  return properties.filter((p) => p.estateId === estateId);
}
