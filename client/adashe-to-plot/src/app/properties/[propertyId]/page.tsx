import { notFound } from "next/navigation";
// import { getPropertiesUsersById } from "@/api/estate";
import EstateDetails from "@/components/estate/EstateDetails";
import { getPropertiesUsersById } from "../../../../api/estate";
// import EstateDetails from "./EstateDetails";

export default async function EstateDetailsPage({
  params,
}: {
  params: Promise<{ estateId: string }>;
}) {
  const { estateId } = await params;

  const response = await getPropertiesUsersById(estateId);

  if (!response?.data) {
    notFound();
  }

  return <EstateDetails estate={response.data} />;
}
