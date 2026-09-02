import type { AtiMember } from "@/types/ati-member";

// ATI Plus membership requires a ₦20,000 annual subscription, paid before
// a member can access ATI Plus benefits, and renewed every 12 months.
export const ATI_PLUS_ANNUAL_FEE = 20000;

// ATI Plus members receive a 5% discount on every property payment plan
// (outright and every installment plan), applied in src/lib/payment.ts.
export const ATI_PLUS_DISCOUNT_RATE = 0.05;

export const atiMembers: AtiMember[] = [
  { id: "ati-001", name: "Emeka Okafor", email: "emeka.okafor@example.com", phone: "+234 803 214 7765", preferredLocation: "Kuje, Abuja", membershipLevel: "Gold", memberSince: "2026-01-05", status: "Active", annualFee: ATI_PLUS_ANNUAL_FEE, subscriptionStatus: "Paid", renewalDate: "2027-01-05" },
  { id: "ati-002", name: "Chiamaka Nwosu", email: "chiamaka.nwosu@example.com", phone: "+234 810 552 9013", preferredLocation: "Kuje, Abuja", membershipLevel: "Platinum", memberSince: "2025-11-20", status: "Active", annualFee: ATI_PLUS_ANNUAL_FEE, subscriptionStatus: "Paid", renewalDate: "2026-11-20" },
  { id: "ati-003", name: "Grace Adeyemi", email: "grace.adeyemi@example.com", phone: "+234 802 990 4471", preferredLocation: "Gwagwalada, Abuja", membershipLevel: "Silver", memberSince: "2026-05-10", status: "Active", annualFee: ATI_PLUS_ANNUAL_FEE, subscriptionStatus: "Paid", renewalDate: "2027-05-10" },
];

export async function getAtiMembers(): Promise<AtiMember[]> {
  return atiMembers;
}
