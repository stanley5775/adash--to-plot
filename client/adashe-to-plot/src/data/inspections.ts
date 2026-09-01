import type { Inspection } from "@/types/inspection";

export const inspections: Inspection[] = [
  {
    id: "insp-001",
    customerName: "Emeka Okafor",
    phone: "+234 803 214 7765",
    email: "emeka.okafor@example.com",
    estateId: "thrive-estate",
    propertyId: "thrive-3bed-penthouse",
    date: "2026-09-12",
    time: "11:00 AM",
    status: "Confirmed",
  },
  {
    id: "insp-002",
    customerName: "Emeka Okafor",
    phone: "+234 803 214 7765",
    email: "emeka.okafor@example.com",
    estateId: "thrive-estate",
    propertyId: "thrive-3bed-penthouse",
    date: "2026-01-02",
    time: "10:00 AM",
    status: "Completed",
  },
  {
    id: "insp-003",
    customerName: "Grace Adeyemi",
    phone: "+234 802 990 4471",
    email: "grace.adeyemi@example.com",
    estateId: "thrive-estate",
    propertyId: "thrive-4bed-semi-detached",
    date: "2026-09-08",
    time: "1:00 PM",
    status: "Pending",
  },
  {
    id: "insp-004",
    customerName: "Ngozi Eze",
    phone: "+234 701 223 9087",
    email: "ngozi.eze@example.com",
    estateId: "amio-vista-homes",
    propertyId: "amio-3bed-bungalow",
    date: "2026-09-06",
    time: "3:30 PM",
    status: "Pending",
  },
  {
    id: "insp-005",
    customerName: "Ibrahim Sule",
    phone: "+234 706 481 2230",
    email: "ibrahim.sule@example.com",
    estateId: "thrive-estate",
    propertyId: "thrive-fully-detached",
    date: "2026-04-01",
    time: "9:00 AM",
    status: "Completed",
  },
];

export async function getInspections(): Promise<Inspection[]> {
  return inspections;
}

export async function getInspectionsByCustomerName(name: string): Promise<Inspection[]> {
  return inspections.filter((i) => i.customerName === name);
}
