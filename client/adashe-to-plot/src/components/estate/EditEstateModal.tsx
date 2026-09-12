"use client";

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

  if (!estate) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    updateEstateNameMutation.mutate(
      {
        estateId: estate.id,
        data: {
          name: formData.get("name")?.toString().trim() ?? "",
          accountName: formData.get("accountName")?.toString().trim() ?? "",
          accountNumber: formData.get("accountNumber")?.toString().trim() ?? "",
          bankName: formData.get("bankName")?.toString().trim() ?? "",
        },
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
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
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

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <Input label="Estate Name" name="name" defaultValue={estate.name} />

          <Input
            label="Account Name"
            name="accountName"
            defaultValue={estate.accountName}
          />

          <Input
            label="Account Number"
            name="accountNumber"
            defaultValue={estate.accountNumber}
            inputMode="numeric"
            maxLength={10}
          />

          <Input
            label="Bank Name"
            name="bankName"
            defaultValue={estate.bankName}
          />

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
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
