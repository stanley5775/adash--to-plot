"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type EstateFormValues = {
  name: string;
};

export function EstateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstateFormValues>();

  function onSubmit(data: EstateFormValues) {
    // API will be added later
    console.log(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl space-y-5 rounded-2xl border border-navy-800/10 bg-white p-6 sm:p-8">
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
        <p className="text-sm text-status-sold">{errors.name.message}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit">Add Estate</Button>

        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
