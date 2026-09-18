"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { EstateForm } from "@/components/admin/EstateForm";
import { useGetEstates } from "../../../../../hook/useGetEstates";

import { EstateTable, type Estate } from "@/components/estate/EstateTable";
import { EditEstateModal } from "@/components/estate/EditEstateModal";
import { DeleteEstateModal } from "@/components/estate/DeleteEstateModal";

export default function AdminEstatesPage() {
  const [estateToDelete, setEstateToDelete] = useState<Estate | null>(null);

  const [estateToEdit, setEstateToEdit] = useState<Estate | null>(null);

  const [showEstateForm, setShowEstateForm] = useState(false);

  const { data: estates = [], isLoading, isError, error } = useGetEstates();

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">Estates</h1>

            <p className="mt-1 text-sm text-ink-500">
              Manage every estate on the platform.
            </p>
          </div>

          <Button type="button" onClick={() => setShowEstateForm(true)}>
            <Plus className="h-4 w-4" />
            Add Estate
          </Button>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="rounded-2xl border border-navy-800/10 bg-white p-8 text-center text-sm text-ink-500">
            Loading estates...
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="rounded-2xl border border-status-sold/20 bg-white p-8 text-center">
            <p className="text-sm text-status-sold">
              {error instanceof Error
                ? error.message
                : "Failed to load estates"}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && !isError && estates.length === 0 && (
          <div className="rounded-2xl border border-navy-800/10 bg-white p-8 text-center">
            <p className="text-sm text-ink-500">
              No estates have been created yet.
            </p>
          </div>
        )}

        {/* TABLE */}
        {!isLoading && !isError && estates.length > 0 && (
          <EstateTable
            estates={estates}
            onEdit={setEstateToEdit}
            onDelete={setEstateToDelete}
          />
        )}
      </div>

      {/* EDIT */}
      <EditEstateModal
        estate={estateToEdit}
        onClose={() => setEstateToEdit(null)}
      />

      {/* DELETE */}
      <DeleteEstateModal
        estate={estateToDelete}
        onClose={() => setEstateToDelete(null)}
      />

      {/* CREATE ESTATE */}
      {showEstateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setShowEstateForm(false)}
              className="absolute right-4 top-4 z-10 rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-navy-950"
              aria-label="Close">
              <X className="h-5 w-5" />
            </button>

            <EstateForm
              onSuccess={() => setShowEstateForm(false)}
              onCancel={() => setShowEstateForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
