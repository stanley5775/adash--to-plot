"use client";

import UsersDashboard from "@/components/users/UsersDashboard";
import { useUser } from "../../../context/UserContext";

export default function DashboardOverviewPage() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  if (user.role !== "CUSTOMER") {
    return null;
  }

  return <UsersDashboard />;
}
