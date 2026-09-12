"use client";

import { X } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";

import { useGetEstates } from "../../../hook/useGetEstates";
import { useUpdateProperty } from "../../../hook/admin";

type EditPropertyModalProps = {
  property: any | null;
  onClose: () => void;
};

export function EditPropertyModal({
  property,
  onClose,
}: EditPropertyModalProps) {
  const updatePropertyMutation = useUpdateProperty();

  const { data: estates = [], isLoading: estatesLoading } = useGetEstates();

  if (!property) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const removeImages = Array.from(
      form.querySelectorAll<HTMLInputElement>(
        'input[name="removeImages"]:checked',
      ),
    ).map((input) => input.value);

    formData.delete("removeImages");

    formData.append("removeImages", JSON.stringify(removeImages));

    updatePropertyMutation.mutate(
      {
        propertyId: property.id,
        formData,
      },
      {
        onSuccess: () => {
          toast.success("Property updated successfully");
          onClose();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const imageFields = [
    {
      type: "main",
      label: "Main Image",
      url: property.mainImgUrl,
      field: "mainImage",
    },
    {
      type: "image1",
      label: "Gallery Image 1",
      url: property.image1Url,
      field: "galleryImage1",
    },
    {
      type: "image2",
      label: "Gallery Image 2",
      url: property.image2Url,
      field: "galleryImage2",
    },
    {
      type: "image3",
      label: "Gallery Image 3",
      url: property.image3Url,
      field: "galleryImage3",
    },
    {
      type: "image4",
      label: "Gallery Image 4",
      url: property.image4Url,
      field: "galleryImage4",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-navy-950">Edit Property</h2>

            <p className="mt-1 text-sm text-ink-500">
              Update property details, images and availability.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={updatePropertyMutation.isPending}
            className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100 hover:text-navy-950">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* BASIC INFORMATION */}
            <section>
              <div className="mb-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-950">
                  Basic Information
                </h3>

                <p className="mt-1 text-xs text-ink-500">
                  Update the estate and property location.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy-950">
                    Estate Name
                  </label>

                  <select
                    name="estateNameId"
                    defaultValue={property.estateId}
                    required
                    disabled={estatesLoading}
                    className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-navy-950 outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10">
                    {estatesLoading ? (
                      <option value="">Loading estates...</option>
                    ) : (
                      estates.map((estate) => (
                        <option key={estate.id} value={estate.id}>
                          {estate.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <Input
                  label="Location"
                  name="location"
                  defaultValue={property.location}
                  required
                />

                <Input
                  label="City"
                  name="city"
                  defaultValue={property.city}
                  required
                />

                <Input
                  label="State"
                  name="state"
                  defaultValue={property.state}
                  required
                />
              </div>
            </section>

            {/* PRICING */}
            <section className="mt-8 border-t border-ink-100 pt-6">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-navy-950">
                Pricing & Availability
              </h3>

              <div className="grid gap-5 md:grid-cols-3">
                <Input
                  label="Starting Price"
                  name="startingPrice"
                  type="number"
                  defaultValue={property.startingPrice}
                  required
                />

                <Input
                  label="Total Plots"
                  name="totalPlots"
                  type="number"
                  defaultValue={property.totalPlots}
                  required
                />

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy-950">
                    Status
                  </label>

                  <select
                    name="status"
                    defaultValue={property.status}
                    required
                    className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Not Active</option>
                  </select>
                </div>
              </div>
            </section>

            {/* DETAILS */}
            <section className="mt-8 border-t border-ink-100 pt-6">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-navy-950">
                Property Details
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy-950">
                    Description
                  </label>

                  <textarea
                    name="description"
                    defaultValue={property.description || ""}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-ink-200 px-3.5 py-3 text-sm outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10"
                  />
                </div>

                <Input
                  label="Features"
                  name="features"
                  defaultValue={property.features?.join(", ") || ""}
                  placeholder="Security, Road, Electricity"
                />

                <Input
                  label="Nearby Landmarks"
                  name="nearbyLandmarks"
                  defaultValue={property.nearbyLandmarks?.join(", ") || ""}
                  placeholder="Airport, School, Hospital"
                />
              </div>
            </section>

            {/* IMAGES */}
            <section className="mt-8 border-t border-ink-100 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-950">
                Property Images
              </h3>

              <p className="mt-1 text-xs text-ink-500">
                Remove an existing image or replace it with a new image.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {imageFields.map((image) => (
                  <div
                    key={image.type}
                    className="overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
                    <div className="aspect-video bg-ink-100">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={image.label}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-ink-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 p-3">
                      <p className="text-sm font-semibold text-navy-950">
                        {image.label}
                      </p>

                      <div className="flex items-center gap-2">
                        {image.url && (
                          <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-status-sold px-3 py-2 text-xs font-medium text-status-sold transition hover:bg-red-50">
                            <input
                              type="checkbox"
                              name="removeImages"
                              value={image.type}
                              className="mr-2 h-4 w-4"
                            />
                            Remove
                          </label>
                        )}

                        <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-navy-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-navy-800">
                          {image.url ? "Replace" : "Add Image"}

                          <input
                            type="file"
                            name={image.field}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-ink-100 bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updatePropertyMutation.isPending}>
              Cancel
            </Button>

            <Button type="submit" disabled={updatePropertyMutation.isPending}>
              {updatePropertyMutation.isPending
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
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-950">
        {label}
      </label>

      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10"
      />
    </div>
  );
}
