import type { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function PropertyGrid({ properties, estateName }: { properties: Property[]; estateName?: string }) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties available right now"
        description="Check back soon, or contact our team about upcoming availability."
      />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} estateName={estateName} />
      ))}
    </div>
  );
}
