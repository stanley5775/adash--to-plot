import {redirect} from "next/navigation";
import { getCurrentCustomer } from "@/services/customer.service";
import { getInspectionsByCustomerName } from "@/services/inspection.service";
import { estates } from "@/data/estates";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { InspectionsList } from "@/components/dashboard/InspectionsList";

export default async function DashboardInspectionsPage() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/login?redirect=/dashboard/inspections");
  }
  const inspections = await getInspectionsByCustomerName(customer.name);
  const estateNames = Object.fromEntries(estates.map((e) => [e.id, e.name]));

  return (
    <div className="space-y-8">
      <DashboardHeader title="Inspections" subtitle="Manage your upcoming and past property inspections." />
      <InspectionsList estateNames={estateNames} initial={inspections} />
    </div>
  );
}
