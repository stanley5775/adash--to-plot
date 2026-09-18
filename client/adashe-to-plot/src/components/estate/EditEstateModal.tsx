"use client";

import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";

import type { Estate } from "./EstateTable";
import { useUpdateEstateName } from "../../../hook/admin";

type EditEstateModalProps = {
  estate: Estate | null;
  onClose: () => void;
};

export function EditEstateModal({ estate, onClose }: EditEstateModalProps) {
  const updateEstateNameMutation = useUpdateEstateName();
  const [removeImage, setRemoveImage] = useState(false);

  if (!estate) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (removeImage) {
      formData.append("removeImage", "true");
    }

    updateEstateNameMutation.mutate(
      {
        estateId: estate.id,
        formData,
      },
      {
        onSuccess: () => {
          toast.success("Estate updated successfully");
          onClose();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-ink-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-navy-950">Edit Estate</h2>

            <p className="mt-1 text-sm text-ink-500">
              Update the estate and bank account information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={updateEstateNameMutation.isPending}
            className="rounded-lg p-2 text-ink-500 transition hover:bg-navy-100 hover:text-navy-950"
            aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 p-6">
            {/* Estate Name */}
            <Input label="Estate Name" name="name" defaultValue={estate.name} />

            {/* Description */}
            <Textarea
              label="Description"
              name="description"
              defaultValue={estate.description ?? ""}
            />

            {/* City */}
            <Input label="City" name="city" defaultValue={estate.city ?? ""} />

            {/* State */}
            <Input
              label="State"
              name="state"
              defaultValue={estate.state ?? ""}
            />

            {/* Starting Price */}
            <Input
              label="Starting Price"
              name="startingPrice"
              defaultValue={estate.startingPrice ?? ""}
              inputMode="decimal"
            />

            {/* Account Name */}
            <Input
              label="Account Name"
              name="accountName"
              defaultValue={estate.accountName}
            />

            {/* Account Number */}
            <Input
              label="Account Number"
              name="accountNumber"
              defaultValue={estate.accountNumber}
              inputMode="numeric"
              maxLength={10}
            />

            {/* Bank Name */}
            <Input
              label="Bank Name"
              name="bankName"
              defaultValue={estate.bankName}
            />

            {/* ESTATE IMAGE */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-950">
                Estate Image
              </label>

              {estate.mainImageUrl && !removeImage && (
                <div className="mb-3">
                  <img
                    src={estate.mainImageUrl}
                    alt={estate.name}
                    className="h-40 w-full rounded-xl object-cover"
                  />
                </div>
              )}

              <input
                type="file"
                name="mainImage"
                accept="image/*"
                className="w-full rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm text-navy-950 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-navy-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-800"
              />

              {estate.mainImageUrl && (
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-ink-600">
                  <input
                    type="checkbox"
                    checked={removeImage}
                    onChange={(e) => setRemoveImage(e.target.checked)}
                    className="h-4 w-4 rounded border-ink-300"
                  />
                  Remove current image
                </label>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 flex shrink-0 justify-end gap-3 border-t border-ink-100 bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateEstateNameMutation.isPending}>
              Cancel
            </Button>

            <Button type="submit" disabled={updateEstateNameMutation.isPending}>
              {updateEstateNameMutation.isPending
                ? "Saving Changes..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  defaultValue,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  defaultValue: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-950">
        {label}
      </label>

      <input
        name={name}
        type="text"
        defaultValue={defaultValue}
        required
        inputMode={inputMode}
        maxLength={maxLength}
        className="w-full rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm text-navy-950 outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10"
      />
    </div>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-950">
        {label}
      </label>

      <textarea
        name={name}
        defaultValue={defaultValue}
        required
        rows={4}
        className="w-full resize-none rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm text-navy-950 outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10"
      />
    </div>
  );
}
