import { atiMembers } from "@/data/ati-members";
import type { AtiMember } from "@/types/ati-member";

export async function getAtiMembers(): Promise<AtiMember[]> {
  return atiMembers;
}

export async function getAtiMemberByName(name: string): Promise<AtiMember | undefined> {
  return atiMembers.find((m) => m.name === name);
}
