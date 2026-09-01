import { customers, CURRENT_CUSTOMER_ID } from "@/data/customers";
import type { Customer } from "@/types/customer";

export async function getCustomers(): Promise<Customer[]> {
  return customers;
}

export async function getCurrentCustomer(): Promise<Customer> {
  return customers.find((c) => c.id === CURRENT_CUSTOMER_ID)!;
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  return customers.find((c) => c.id === id);
}
