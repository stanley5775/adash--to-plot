import { EstateForm } from "@/components/admin/EstateForm";

export default function AdminNewEstatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Add Estate</h1>
        <p className="mt-1 text-sm text-ink-500">Create a new estate record (frontend-only for now).</p>
      </div>
      <EstateForm />
    </div>
  );
}
