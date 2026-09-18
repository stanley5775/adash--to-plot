"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateEstateName } from "../../../hook/useCreateEstateName";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

type EstateFormValues = {
  name: string;
  description: string;
  city: string;
  state: string;
  startingPrice: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  mainImage: FileList;
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
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("startingPrice", data.startingPrice);
    formData.append("accountName", data.accountName);
    formData.append("accountNumber", data.accountNumber);
    formData.append("bankName", data.bankName);

    if (data.mainImage?.[0]) {
      formData.append("mainImage", data.mainImage[0]);
    }

    createEstate.mutate(formData, {
      onSuccess: () => {
        toast.success("Estate created successfully");
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

      {/* Description */}
      <div>
        <label
          htmlFor="estate-description"
          className="mb-1 block text-sm font-medium text-navy-900">
          Estate description
        </label>

        <textarea
          id="estate-description"
          placeholder="Describe the estate..."
          rows={4}
          className="w-full resize-none rounded-xl border border-navy-800/10 bg-white px-4 py-3 text-sm outline-none focus:border-navy-800"
          {...register("description", {
            required: "Estate description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
            validate: (value) =>
              value.trim().length >= 10 ||
              "Estate description must be at least 10 characters",
          })}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <Input
          label="City"
          id="estate-city"
          placeholder="e.g. Kuje"
          {...register("city", {
            required: "City is required",
            minLength: {
              value: 2,
              message: "City must be at least 2 characters",
            },
          })}
        />

        {errors.city && (
          <p className="mt-1 text-sm text-status-sold">{errors.city.message}</p>
        )}
      </div>

      {/* State */}
      <div>
        <Input
          label="State"
          id="estate-state"
          placeholder="e.g. FCT"
          {...register("state", {
            required: "State is required",
            minLength: {
              value: 2,
              message: "State must be at least 2 characters",
            },
          })}
        />

        {errors.state && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.state.message}
          </p>
        )}
      </div>

      {/* Starting Price */}
      <div>
        <Input
          label="Starting price"
          id="estate-starting-price"
          placeholder="e.g. 5000000"
          inputMode="decimal"
          {...register("startingPrice", {
            required: "Starting price is required",
            validate: (value) =>
              Number(value) > 0 || "Starting price must be greater than 0",
          })}
        />

        {errors.startingPrice && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.startingPrice.message}
          </p>
        )}
      </div>

      {/* Main Estate Image */}
      <div>
        <label
          htmlFor="estate-main-image"
          className="mb-1 block text-sm font-medium text-navy-900">
          Estate main image
        </label>

        <input
          id="estate-main-image"
          type="file"
          accept="image/*"
          {...register("mainImage", {
            required: "Estate main image is required",
            validate: (files) =>
              files?.length > 0 || "Estate main image is required",
          })}
          className="block w-full rounded-xl border border-navy-800/10 bg-white p-3 text-sm"
        />

        {errors.mainImage && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.mainImage.message}
          </p>
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
