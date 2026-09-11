"use client";

import AdminOverviewPage from "@/components/admin/AdminOverviewPage";
import { useUser } from "../../../../context/UserContext";

export default function DashboardOverviewPage() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  if (user.role !== "ADMIN" && user.role !== "SUB_ADMIN") {
    return null;
  }

  return <AdminOverviewPage />;
}
