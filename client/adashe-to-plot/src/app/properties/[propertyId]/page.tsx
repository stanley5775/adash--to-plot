import { notFound } from "next/navigation";

import { PropertyCard } from "@/components/property/PropertyCard";
import { getPropertiesByEstate } from "../../../../api/estate";
import PropertyDetails from "@/components/estate/PropertyDetails";

export default async function EstateDetailsPage({
  params,
}: {
  params: Promise<{ estateId: string }>;
}) {
  const { estateId } = await params;

  const response = await getPropertiesByEstate(estateId);

  if (!response?.data) {
    notFound();
  }

  return (
    <div className="container-page py-16">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {response.data.map((property: any) => (
          <PropertyDetails property={response.data} />
        ))}
      </div>
    </div>
  );
}
