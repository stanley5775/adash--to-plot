"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

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
  galleryImages: FileList;
};

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

export function EstateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstateFormValues>({
    defaultValues: {
      status: "ACTIVE",
    },
  });

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
    formData.append("status", data.status);

    if (data.mainImage?.[0]) {
      formData.append("mainImage", data.mainImage[0]);
    }

    if (data.galleryImages) {
      Array.from(data.galleryImages)
        .slice(0, 4)
        .forEach((file) => {
          formData.append("galleryImages", file);
        });
    }

    console.log(formData);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-2xl border border-navy-800/10 bg-white p-6 sm:grid-cols-2 sm:p-8">
      {/* estateNameId */}
      <div>
        <Select
          label="Estate Name"
          id="estateNameId"
          options={estateNames.map((estate) => ({
            label: estate.name,
            value: estate.id,
          }))}
          {...register("estateNameId", {
            required: "Estate name is required",
          })}
        />

        {errors.estateNameId && (
          <p className="mt-1 text-sm text-status-sold">
            {errors.estateNameId.message}
          </p>
        )}
      </div>

      {/* location */}
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

      {/* city */}
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

      {/* state */}
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

      {/* startingPrice */}
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

      {/* totalPlots */}
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

      {/* status */}
      <div>
        <Select
          label="Status"
          id="status"
          options={[
            {
              label: "Active",
              value: "ACTIVE",
            },
            {
              label: "Inactive",
              value: "INACTIVE",
            },
          ]}
          {...register("status")}
        />
      </div>

      {/* description */}
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

      {/* features */}
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

      {/* nearbyLandmarks */}
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

      {/* mainImage */}
      <div>
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
      </div>

      {/* galleryImages */}
      <div>
        <label
          htmlFor="galleryImages"
          className="text-sm font-medium text-ink-700">
          Gallery Images
        </label>

        <input
          id="galleryImages"
          type="file"
          accept="image/*"
          multiple
          className="mt-1.5 w-full text-sm"
          {...register("galleryImages")}
        />

        <p className="mt-1 text-xs text-ink-500">Maximum 4 gallery images.</p>
      </div>

      {/* submit */}
      <div className="sm:col-span-2">
        <Button type="submit">Save Estate</Button>
      </div>
    </form>
  );
}
