import { Property } from "@/components/admin/PropertyForm";

export default function AdminNewPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Add Property</h1>
        <p className="mt-1 text-sm text-ink-500">
          Create a new property record (frontend-only for now).
        </p>
      </div>
      <Property />
    </div>
  );
}
