"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { useGetEstates } from "../../../../../hook/useGetEstates";
import { EstateForm } from "@/components/admin/EstateForm";

type Estate = {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  createdAt: string;
};

const columns: Column<Estate>[] = [
  {
    header: "Estate",
    render: (estate) => (
      <span className="font-semibold text-navy-950">{estate.name}</span>
    ),
  },
  {
    header: "Account Name",
    render: (estate) => estate.accountName,
  },
  {
    header: "Account Number",
    render: (estate) => estate.accountNumber,
  },
  {
    header: "Bank",
    render: (estate) => estate.bankName,
  },
];

export default function AdminEstatesPage() {
  const [estateToDelete, setEstateToDelete] = useState<Estate | null>(null);
  const [showEstateForm, setShowEstateForm] = useState(false);
  const { data: estates = [], isLoading, isError, error } = useGetEstates();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">Estates</h1>

            <p className="mt-1 text-sm text-ink-500">
              Manage every estate on the platform.
            </p>
          </div>

          {/* <Button href="/admin/estates/new">
            <Plus className="h-4 w-4" />
            Add Estate
          </Button> */}
          <Button type="button" onClick={() => setShowEstateForm(true)}>
            <Plus className="h-4 w-4" />
            Add Estate
          </Button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="rounded-2xl border border-navy-800/10 bg-white p-8 text-center text-sm text-ink-500">
            Loading estates...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-2xl border border-status-sold/20 bg-white p-8 text-center">
            <p className="text-sm text-status-sold">
              {error instanceof Error
                ? error.message
                : "Failed to load estates"}
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && estates.length === 0 && (
          <div className="rounded-2xl border border-navy-800/10 bg-white p-8 text-center">
            <p className="text-sm text-ink-500">
              No estates have been created yet.
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && estates.length > 0 && (
          <DataTable
            columns={columns}
            rows={estates}
            actions={(estate) => (
              <div className="flex items-center gap-2">
                {/* ADD PROPERTY */}
                <Link
                  href={`/${estate.id}/properties/new`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-navy-700 transition hover:bg-navy-100 hover:text-navy-950">
                  <Plus className="h-4 w-4" />
                  Add Property
                </Link>

                {/* EDIT ESTATE */}
                <Link
                  href={`/admin/estates/${estate.id}/edit`}
                  className="rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-navy-900"
                  aria-label={`Edit ${estate.name}`}>
                  <Pencil className="h-4 w-4" />
                </Link>

                {/* DELETE ESTATE */}
                <button
                  type="button"
                  onClick={() => setEstateToDelete(estate)}
                  className="rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-status-sold"
                  aria-label={`Delete ${estate.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          />
        )}
      </div>

      {/* DELETE CONFIRMATION */}
      {estateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-950">
                  Delete Estate
                </h2>

                <p className="mt-2 text-sm text-ink-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-navy-950">
                    {estateToDelete.name}
                  </span>
                  ?
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEstateToDelete(null)}
                className="rounded-lg p-2 text-ink-500 hover:bg-navy-100"
                aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm text-status-sold">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEstateToDelete(null)}>
                Cancel
              </Button>

              <Button
                type="button"
                onClick={() => {
                  // Delete API will go here
                  setEstateToDelete(null);
                }}
                className="bg-status-sold hover:bg-status-sold/90">
                Delete Estate
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEstateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Close */}
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
