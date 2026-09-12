"use client";

import { X } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";

import type { Estate } from "./EstateTable";
import { useDeleteEstateName } from "../../../hook/admin";

type DeleteEstateModalProps = {
  estate: Estate | null;
  onClose: () => void;
};

export function DeleteEstateModal({ estate, onClose }: DeleteEstateModalProps) {
  const deleteEstateNameMutation = useDeleteEstateName();

  if (!estate) return null;

  const handleDelete = () => {
    deleteEstateNameMutation.mutate(estate.id, {
      onSuccess: () => {
        toast.success("Estate deleted successfully");
        onClose();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-950">Delete Estate</h2>

            <p className="mt-2 text-sm text-ink-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-navy-950">{estate.name}</span>
              ?
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleteEstateNameMutation.isPending}
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
            onClick={onClose}
            disabled={deleteEstateNameMutation.isPending}>
            Cancel
          </Button>

          <Button
            type="button"
            disabled={deleteEstateNameMutation.isPending}
            onClick={handleDelete}
            className="bg-status-sold hover:bg-status-sold/90">
            {deleteEstateNameMutation.isPending
              ? "Deleting..."
              : "Delete Estate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
