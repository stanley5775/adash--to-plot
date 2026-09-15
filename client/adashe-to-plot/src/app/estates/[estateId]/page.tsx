"use client";

import { use } from "react";

import { PropertyGrid } from "@/components/property/PropertyGrid";
import { useGetPropertiesByEstate } from "../../../../hook/estates";

export default function EstateDetailsPage({
  params,
}: {
  params: Promise<{ estateId: string }>;
}) {
  const { estateId } = use(params);

  const { data, isLoading, error } = useGetPropertiesByEstate(estateId);

  console.log("ESTATE ID:", estateId);
  console.log("ESTATE DATA:", data);

  return (
    <PropertyGrid
      properties={data?.data?.properties ?? []}
      estate={data?.data?.estate}
      isLoading={isLoading}
    />
  );
}
