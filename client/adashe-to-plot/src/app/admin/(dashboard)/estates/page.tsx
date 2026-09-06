"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type Estate = {
  id: string;
  name: string;
  location: string;
  totalPlots: number;
  availablePlots: number;
  soldPlots: number;
  startingPrice: number;
  developmentStatus: "Selling Fast" | "Available";
};

// Dummy data for UI
const estates: Estate[] = [
  {
    id: "1",
    name: "Adashè Estate",
    location: "Awka, Anambra",
    totalPlots: 100,
    availablePlots: 48,
    soldPlots: 52,
    startingPrice: 2500000,
    developmentStatus: "Selling Fast",
  },
  {
    id: "2",
    name: "Thrive Estate",
    location: "Awka, Anambra",
    totalPlots: 75,
    availablePlots: 32,
    soldPlots: 43,
    startingPrice: 3500000,
    developmentStatus: "Available",
  },
  {
    id: "3",
    name: "AMIO Vista Homes",
    location: "Nnewi, Anambra",
    totalPlots: 75,
    availablePlots: 48,
    soldPlots: 27,
    startingPrice: 4500000,
    developmentStatus: "Available",
  },
];

const formatNaira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

const columns: Column<Estate>[] = [
  {
    header: "Estate",
    render: (estate) => (
      <span className="font-semibold text-navy-950">{estate.name}</span>
    ),
  },
  {
    header: "Location",
    render: (estate) => estate.location,
  },
  {
    header: "Total Plots",
    render: (estate) => estate.totalPlots,
  },
  {
    header: "Available",
    render: (estate) => estate.availablePlots,
  },
  {
    header: "Sold",
    render: (estate) => estate.soldPlots,
  },
  {
    header: "Starting Price",
    render: (estate) => formatNaira(estate.startingPrice),
  },
  {
    header: "Status",
    render: (estate) => (
      <Badge
        tone={estate.developmentStatus === "Selling Fast" ? "gold" : "info"}>
        {estate.developmentStatus}
      </Badge>
    ),
  },
];

export default function AdminEstatesPage() {
  const [estateToDelete, setEstateToDelete] = useState<Estate | null>(null);

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

          <Button href="/admin/estates/new">
            <Plus className="h-4 w-4" />
            Add Estate
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          rows={estates}
          actions={(estate) => (
            <div className="flex items-center gap-2">
              {/* EDIT */}
              <Link
                href={`/admin/estates/${estate.id}/edit`}
                className="rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-navy-900"
                aria-label={`Edit ${estate.name}`}>
                <Pencil className="h-4 w-4" />
              </Link>

              {/* DELETE */}
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
                  // API later:
                  // await deleteEstate(estateToDelete.id)

                  setEstateToDelete(null);
                }}
                className="bg-status-sold hover:bg-status-sold/90">
                Delete Estate
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
