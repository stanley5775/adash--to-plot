export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  estateId: string;
  status: "Active" | "Completed" | "In Arrears";
  dateJoined: string;
  isAtiPlusMember: boolean;
}
