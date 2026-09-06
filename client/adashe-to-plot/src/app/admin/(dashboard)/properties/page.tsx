"use client";

import { useState } from "react";
import { Plus, Eye, Pencil, Trash2, X } from "lucide-react";

import { estates } from "@/data/estates";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Estate } from "@/types/estate";

const estateNames = [
  {
    id: "estate-name-1",
    name: "Adashè Estate",
  },
  {
    id: "estate-name-2",
    name: "Thrive Estate",
  },
  {
    id: "estate-name-3",
    name: "AMIO Vista Homes",
  },
];

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
    header: "State",
    render: (estate) => estate.state,
  },
  {
    header: "Starting Price",
    render: (estate) => `₦${Number(estate.startingPrice).toLocaleString()}`,
  },
  {
    header: "Total Plots",
    render: (estate) => estate.totalPlots,
  },
  {
    header: "Description",
    render: (estate) => estate.description || "—",
  },
  {
    header: "Features",
    render: (estate) =>
      estate.features?.length ? estate.features.join(", ") : "—",
  },
  {
    header: "Nearby Landmarks",
    render: (estate) =>
      estate.nearbyLandmarks?.length ? estate.nearbyLandmarks.join(", ") : "—",
  },
];

export default function AdminEstatePage() {
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);

  const [estateToDelete, setEstateToDelete] = useState<Estate | null>(null);

  const [formData, setFormData] = useState({
    estateNameId: "",
    location: "",
    city: "",
    state: "",
    description: "",
    startingPrice: "",
    totalPlots: "",
    features: "",
    nearbyLandmarks: "",
  });

  function handleEdit(estate: Estate) {
    setSelectedEstate(estate);

    setFormData({
      estateNameId: estate.estateNameId,
      location: estate.location,
      city: estate.city,
      state: estate.state,
      description: estate.description ?? "",
      startingPrice: String(estate.startingPrice ?? ""),
      totalPlots: String(estate.totalPlots ?? ""),
      features: estate.features?.join(", ") ?? "",
      nearbyLandmarks: estate.nearbyLandmarks?.join(", ") ?? "",
    });
  }

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSave() {
    // Connect your PUT/PATCH API here later.
    console.log("Update estate:", {
      id: selectedEstate?.estateNameId,
      ...formData,
    });

    setSelectedEstate(null);
  }

  function handleDelete() {
    if (!estateToDelete) return;

    // Connect your DELETE API here later.
    console.log("Delete estate:", estateToDelete.estateNameId);

    setEstateToDelete(null);
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-950">Estates</h1>

            <p className="mt-1 text-sm text-ink-500">Manage all estates.</p>
          </div>

          <Button href="/admin/properties/new">
            <Plus className="h-4 w-4" />
            Add properties
          </Button>
        </div>

        {/* Table */}
        <DataTable<Estate>
          columns={columns}
          rows={estates}
          actions={(estate) => (
            <div className="flex items-center gap-2">
              {/* View */}

              {/* Edit */}
              <button
                type="button"
                onClick={() => handleEdit(estate)}
                className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-navy-900"
                aria-label="Edit estate">
                <Pencil className="h-4 w-4" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => setEstateToDelete(estate)}
                className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-status-sold"
                aria-label="Delete estate">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        />
      </div>

      {/* ================= EDIT MODAL ================= */}
      {selectedEstate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-navy-950">Edit Estate</h2>

                <p className="mt-1 text-sm text-ink-500">
                  Update estate information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEstate(null)}
                className="rounded-lg p-2 text-ink-500 hover:bg-navy-100 hover:text-navy-900"
                aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
              <Select
                label="Estate Name"
                id="edit-estateNameId"
                value={formData.estateNameId}
                options={estateNames.map((estate) => ({
                  label: estate.name,
                  value: estate.id,
                }))}
                onChange={(e) => handleChange("estateNameId", e.target.value)}
              />

              <Input
                label="Location"
                id="edit-location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />

              <Input
                label="City"
                id="edit-city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />

              <Input
                label="State"
                id="edit-state"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              />

              <Input
                label="Starting Price (₦)"
                id="edit-startingPrice"
                type="number"
                value={formData.startingPrice}
                onChange={(e) => handleChange("startingPrice", e.target.value)}
              />

              <Input
                label="Total Plots"
                id="edit-totalPlots"
                type="number"
                value={formData.totalPlots}
                onChange={(e) => handleChange("totalPlots", e.target.value)}
              />

              <div className="sm:col-span-2">
                <label
                  htmlFor="edit-description"
                  className="text-sm font-medium text-ink-700">
                  Description
                </label>

                <textarea
                  id="edit-description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20"
                />
              </div>

              <Input
                label="Features"
                id="edit-features"
                value={formData.features}
                placeholder="Road, Electricity, Security"
                onChange={(e) => handleChange("features", e.target.value)}
              />

              <Input
                label="Nearby Landmarks"
                id="edit-nearbyLandmarks"
                value={formData.nearbyLandmarks}
                placeholder="Market, Hospital, School"
                onChange={(e) =>
                  handleChange("nearbyLandmarks", e.target.value)
                }
              />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedEstate(null)}>
                Cancel
              </Button>

              <Button type="button" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {estateToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-navy-950">Delete Estate</h2>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-navy-950">
                {estateToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEstateToDelete(null)}>
                Cancel
              </Button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-status-sold px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
                Delete Estate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
