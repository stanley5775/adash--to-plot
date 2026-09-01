export interface AtiMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredLocation: string;
  membershipLevel: "Silver" | "Gold" | "Platinum";
  memberSince: string;
  status: "Active" | "Inactive";
  annualFee: number;
  subscriptionStatus: "Paid" | "Due" | "Overdue";
  renewalDate: string;
}
