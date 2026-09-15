"use client";

import { use } from "react";

import { useGetPropertiesUsersById } from "../../../../hook/estates";
import PropertyDetails from "@/components/estate/PropertyDetails";

export default function EstateDetailsPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = use(params);

  const { data, isLoading, isError } = useGetPropertiesUsersById(propertyId);

  console.log("PROPERTY RESPONSE:", data);
  console.log("PROPERTY RESPONSE:", data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load property.</div>;
  }

  return (
    <PropertyDetails property={data.data} estateName={data.data.estate?.name} />
  );
}
