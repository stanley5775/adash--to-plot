"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useGetEstates } from "../../../hook/useGetEstates";
import { useCreateEstate } from "../../../hook/admin";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

type EstateFormValues = {
  estateNameId: string;
  location: string;
  city: string;
  state: string;
  description: string;
  startingPrice: string;
  totalPlots: string;
  features: string;
  nearbyLandmarks: string;
  status: string;
  mainImage: FileList;

  // 4 optional gallery images
  galleryImage1: FileList;
  galleryImage2: FileList;
  galleryImage3: FileList;
  galleryImage4: FileList;
};

export function Property() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EstateFormValues>({
    defaultValues: {
      status: "ACTIVE",
    },
  });
  const { data: estates = [], isLoading: estatesLoading } = useGetEstates();
  const createEstate = useCreateEstate();
  function onSubmit(data: EstateFormValues) {
    const formData = new FormData();

    formData.append("estateNameId", data.estateNameId);
    formData.append("location", data.location);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("description", data.description);
    formData.append("startingPrice", data.startingPrice);
    formData.append("totalPlots", data.totalPlots);
    formData.append("features", data.features);
    formData.append("nearbyLandmarks", data.nearbyLandmarks);

    // Main image
    if (data.mainImage?.[0]) {
      formData.append("mainImage", data.mainImage[0]);
    }

    // Gallery Image 1
    if (data.galleryImage1?.[0]) {
      formData.append("galleryImages", data.galleryImage1[0]);
    }

    // Gallery Image 2
    if (data.galleryImage2?.[0]) {
      formData.append("galleryImages", data.galleryImage2[0]);
    }

    // Gallery Image 3
    if (data.galleryImage3?.[0]) {
      formData.append("galleryImages", data.galleryImage3[0]);
    }

    // Gallery Image 4
    if (data.galleryImage4?.[0]) {
      formData.append("galleryImages", data.galleryImage4[0]);
    }
    createEstate.mutate(formData, {
      onSuccess: () => {
        toast.success("Property created successfully");
        reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-2xl border border-navy-800/10 bg-white p-6 sm:grid-cols-2 sm:p-8">
      {/* Estate Name */}
      <div className="space-y-2">
        <Select
          label="Estate Name"
          id="estateNameId"
          disabled={estatesLoading}
          options={
            estatesLoading
              ? [
                  {
                    value: "",
                    label: "Loading estates...",
                  },
                ]
              : [
                  {
                    value: "",
                    label: "No selection",
                  },
                  ...estates.map((estate) => ({
                    value: estate.id,
                    label: estate.name,
                  })),
                ]
          }
          {...register("estateNameId", {
            required: "Estate name is required",
          })}
        />

        {errors.estateNameId && (
          <p className="text-sm text-red-500">{errors.estateNameId.message}</p>
        )}
      </div>
      {/* Location */}
      <div>
        <Input
          label="Location"
          id="location"
          placeholder="e.g. Kuje District"
          {...register("location", {
            required: "Location is required",
          })}
        />

        {errors.location && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.location.message}
          </p>
        )}
      </div>
      {/* City */}
      <div>
        <Input
          label="City"
          id="city"
          placeholder="e.g. Abuja"
          {...register("city", {
            required: "City is required",
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
          id="state"
          placeholder="e.g. FCT"
          {...register("state", {
            required: "State is required",
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
          label="Starting Price (₦)"
          id="startingPrice"
          type="number"
          placeholder="1500000"
          {...register("startingPrice", {
            required: "Starting price is required",
          })}
        />

        {errors.startingPrice && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.startingPrice.message}
          </p>
        )}
      </div>
      {/* Total Plots */}
      <div>
        <Input
          label="Total Plots"
          id="totalPlots"
          type="number"
          placeholder="120"
          {...register("totalPlots", {
            required: "Total plots is required",
          })}
        />

        {errors.totalPlots && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.totalPlots.message}
          </p>
        )}
      </div>
      {/* Status */}
      {/* Description */}
      <div className="sm:col-span-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-ink-700">
          Description
        </label>

        <textarea
          id="description"
          rows={4}
          placeholder="Describe the estate..."
          className="mt-1.5 w-full rounded-xl border border-navy-800/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20"
          {...register("description")}
        />
      </div>
      {/* Features */}
      <div>
        <Input
          label="Features"
          id="features"
          placeholder="Road, Electricity, Security"
          {...register("features")}
        />

        <p className="mt-1 text-xs text-ink-500">
          Separate features with commas.
        </p>
      </div>
      {/* Nearby Landmarks */}
      <div>
        <Input
          label="Nearby Landmarks"
          id="nearbyLandmarks"
          placeholder="Market, Hospital, School"
          {...register("nearbyLandmarks")}
        />

        <p className="mt-1 text-xs text-ink-500">
          Separate landmarks with commas.
        </p>
      </div>
      {/* Main Image */}
      <div className="sm:col-span-2">
        <label htmlFor="mainImage" className="text-sm font-medium text-ink-700">
          Main Image
        </label>

        <input
          id="mainImage"
          type="file"
          accept="image/*"
          className="mt-1.5 w-full text-sm"
          {...register("mainImage")}
        />

        <p className="mt-1 text-xs text-ink-500">Main property image.</p>
      </div>
      {/*GALLERY */}
      <div className="sm:col-span-2">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-navy-950">
            Property Gallery
          </h3>

          <p className="mt-1 text-xs text-ink-500">
            Add up to 4 additional property images. All gallery images are
            optional.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Gallery Image 1 */}
          <div>
            <label
              htmlFor="galleryImage1"
              className="text-sm font-medium text-ink-700">
              Gallery Image 1{" "}
              <span className="font-normal text-ink-400">(optional)</span>
            </label>

            <input
              id="galleryImage1"
              type="file"
              accept="image/*"
              className="mt-1.5 w-full text-sm"
              {...register("galleryImage1")}
            />
          </div>

          {/* Gallery Image 2 */}
          <div>
            <label
              htmlFor="galleryImage2"
              className="text-sm font-medium text-ink-700">
              Gallery Image 2{" "}
              <span className="font-normal text-ink-400">(optional)</span>
            </label>

            <input
              id="galleryImage2"
              type="file"
              accept="image/*"
              className="mt-1.5 w-full text-sm"
              {...register("galleryImage2")}
            />
          </div>

          {/* Gallery Image 3 */}
          <div>
            <label
              htmlFor="galleryImage3"
              className="text-sm font-medium text-ink-700">
              Gallery Image 3{" "}
              <span className="font-normal text-ink-400">(optional)</span>
            </label>

            <input
              id="galleryImage3"
              type="file"
              accept="image/*"
              className="mt-1.5 w-full text-sm"
              {...register("galleryImage3")}
            />
          </div>

          {/* Gallery Image 4 */}
          <div>
            <label
              htmlFor="galleryImage4"
              className="text-sm font-medium text-ink-700">
              Gallery Image 4{" "}
              <span className="font-normal text-ink-400">(optional)</span>
            </label>

            <input
              id="galleryImage4"
              type="file"
              accept="image/*"
              className="mt-1.5 w-full text-sm"
              {...register("galleryImage4")}
            />
          </div>
        </div>
      </div>
      {/* Submit */}

      <Button
        type="submit"
        disabled={createEstate.isPending}
        className="mt-2 disabled:cursor-not-allowed disabled:opacity-50">
        {createEstate.isPending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Save property"
        )}
      </Button>
    </form>
  );
}
