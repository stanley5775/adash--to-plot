import type { Customer } from "@/types/customer";

// Emeka Okafor is the demo customer used to populate the signed-in Customer Dashboard.
export const customers: Customer[] = [
  {
    id: "cust-001",
    name: "Emeka Okafor",
    email: "emeka.okafor@example.com",
    phone: "+234 803 214 7765",
    propertyId: "thrive-3bed-penthouse",
    estateId: "thrive-estate",
    status: "Active",
    dateJoined: "2026-01-05",
    isAtiPlusMember: true,
  },
  {
    id: "cust-002",
    name: "Chiamaka Nwosu",
    email: "chiamaka.nwosu@example.com",
    phone: "+234 810 552 9013",
    propertyId: "amio-2bed-bungalow",
    estateId: "amio-vista-homes",
    status: "Completed",
    dateJoined: "2025-11-20",
    isAtiPlusMember: true,
  },
  {
    id: "cust-003",
    name: "Ibrahim Sule",
    email: "ibrahim.sule@example.com",
    phone: "+234 706 481 2230",
    propertyId: "thrive-fully-detached",
    estateId: "thrive-estate",
    status: "Active",
    dateJoined: "2026-04-02",
    isAtiPlusMember: false,
  },
  {
    id: "cust-004",
    name: "Grace Adeyemi",
    email: "grace.adeyemi@example.com",
    phone: "+234 802 990 4471",
    propertyId: "thrive-4bed-semi-detached",
    estateId: "thrive-estate",
    status: "Active",
    dateJoined: "2026-05-10",
    isAtiPlusMember: true,
  },
  {
    id: "cust-005",
    name: "Tunde Bakare",
    email: "tunde.bakare@example.com",
    phone: "+234 813 667 8820",
    propertyId: "amio-3bed-bungalow",
    estateId: "amio-vista-homes",
    status: "In Arrears",
    dateJoined: "2026-06-01",
    isAtiPlusMember: false,
  },
];

export const CURRENT_CUSTOMER_ID = "cust-001";

export async function getCustomers(): Promise<Customer[]> {
  return customers;
}

export async function getCurrentCustomer(): Promise<Customer> {
  return customers.find((c) => c.id === CURRENT_CUSTOMER_ID)!;
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  return customers.find((c) => c.id === id);
}
