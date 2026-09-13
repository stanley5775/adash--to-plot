"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useUser } from "../../../context/UserContext";
import { useLogout } from "../../../hook/useLogout";

export function AdminSessionBar() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      // Clear the user from React state
      setUser(null);

      // Send user back to login
      router.push("/login");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white">
          {user?.full_name || "Admin User"}
        </p>

        <p className="truncate text-[11px] text-navy-100/50">
          {user?.email || "admin@example.com"}
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        aria-label="Log out"
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-navy-100/70 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
        <LogOut className="h-3.5 w-3.5" />
        {logoutMutation.isPending ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
