"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";

import { useGetProperties, useDeleteProperty } from "../../../../../hook/admin";

import { DeletePropertyModal } from "@/components/properties/DeletePropertyModal";
import { EditPropertyModal } from "@/components/properties/EditPropertyModal";
import { PropertyTable } from "@/components/properties/PropertyTable";
import { AddPaymentPlanModal } from "@/components/properties/AddPaymentPlanModal";

export default function AdminEstatePage() {
  const [propertyToDelete, setPropertyToDelete] = useState<any | null>(null);
  const [propertyForPaymentPlan, setPropertyForPaymentPlan] = useState<
    any | null
  >(null);
  const [propertyToEdit, setPropertyToEdit] = useState<any | null>(null);

  const {
    data: properties = [],
    isLoading,
    isError,
    error,
  } = useGetProperties();

  const deletePropertyMutation = useDeleteProperty();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-ink-500">Loading properties...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Failed to load properties"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">Properties</h1>

            <p className="mt-1 text-sm text-ink-500">Manage all properties.</p>
          </div>

          <Button href="/admin/properties/new">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </div>
        <AddPaymentPlanModal
          property={propertyForPaymentPlan}
          onClose={() => setPropertyForPaymentPlan(null)}
        />
        <PropertyTable
          properties={properties}
          onEdit={setPropertyToEdit}
          onDelete={setPropertyToDelete}
          onAddPaymentPlan={setPropertyForPaymentPlan}
        />
      </div>

      <DeletePropertyModal
        property={propertyToDelete}
        mutation={deletePropertyMutation}
        onClose={() => setPropertyToDelete(null)}
        onSuccess={() => {
          toast.success("Property deleted successfully");
          setPropertyToDelete(null);
        }}
      />

      <EditPropertyModal
        property={propertyToEdit}
        onClose={() => setPropertyToEdit(null)}
      />
    </>
  );
}
