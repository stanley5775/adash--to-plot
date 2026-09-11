"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateEstateName } from "../../../hook/useCreateEstateName";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

type EstateFormValues = {
  name: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
};
type EstateFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};
export function EstateForm({ onSuccess, onCancel }: EstateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EstateFormValues>();

  const createEstate = useCreateEstateName();

  function onSubmit(data: EstateFormValues) {
    createEstate.mutate(data, {
      onSuccess: () => {
        toast.success("estate created sucessfully");
        reset();
        onSuccess?.();
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl space-y-5 rounded-2xl border border-navy-800/10 bg-white p-6 sm:p-8">
      {/* Estate Name */}
      <div>
        <Input
          label="Estate name"
          id="e-name"
          placeholder="e.g. The Thrive Estate"
          {...register("name", {
            required: "Estate name is required",
            minLength: {
              value: 3,
              message: "Estate name must be at least 3 characters",
            },
            validate: (value) =>
              value.trim().length >= 3 ||
              "Estate name must be at least 3 characters",
          })}
        />

        {errors.name && (
          <p className="mt-1 text-sm text-status-sold">{errors.name.message}</p>
        )}
      </div>

      {/* Account Name */}
      <div>
        <Input
          label="Account name"
          id="account-name"
          placeholder="e.g. Thrive Estate Limited"
          {...register("accountName", {
            required: "Account name is required",
            minLength: {
              value: 3,
              message: "Account name must be at least 3 characters",
            },
            validate: (value) =>
              value.trim().length >= 3 ||
              "Account name must be at least 3 characters",
          })}
        />

        {errors.accountName && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.accountName.message}
          </p>
        )}
      </div>

      {/* Account Number */}
      <div>
        <Input
          label="Account number"
          id="account-number"
          placeholder="e.g. 0123456789"
          inputMode="numeric"
          maxLength={10}
          {...register("accountNumber", {
            required: "Account number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Account number must be exactly 10 digits",
            },
          })}
        />

        {errors.accountNumber && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      {/* Bank Name */}
      <div>
        <Input
          label="Bank name"
          id="bank-name"
          placeholder="e.g. Access Bank"
          {...register("bankName", {
            required: "Bank name is required",
            minLength: {
              value: 2,
              message: "Bank name must be at least 2 characters",
            },
            validate: (value) =>
              value.trim().length >= 2 ||
              "Bank name must be at least 2 characters",
          })}
        />

        {errors.bankName && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.bankName.message}
          </p>
        )}
      </div>

      {/* API error */}
      {createEstate.isError && (
        <p className="text-sm text-status-sold">{createEstate.error.message}</p>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={createEstate.isPending}
          className="mt-2 disabled:cursor-not-allowed disabled:opacity-50">
          {createEstate.isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Adding estate
            </>
          ) : (
            "Add estate"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            onCancel?.();
          }}
          disabled={createEstate.isPending}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
