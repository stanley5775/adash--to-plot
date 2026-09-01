import type { Estate } from "@/types/estate";
import { EstateCard } from "./EstateCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function EstateGrid({ estates }: { estates: Estate[] }) {
  if (estates.length === 0) {
    return (
      <EmptyState
        title="No estates match your search"
        description="Try adjusting your filters or search a different location."
      />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {estates.map((estate) => (
        <EstateCard key={estate.id} estate={estate} />
      ))}
    </div>
  );
}
