"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle } from "lucide-react";
import { getCurrentAdmin, adminLogout } from "@/services/admin-auth.service";
import type { AdminUser } from "@/types/admin-auth";

export function AdminSessionBar() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    getCurrentAdmin().then((current) => {
      if (!active) return;
      setAdmin(current);
      setChecked(true);
      if (!current) {
        router.replace("/login");
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await adminLogout();
    router.push("/login");
    router.refresh();
  }

  if (!checked || !admin) return null;

  return (
    <div className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white">
          {admin.fullName}
        </p>
        <p className="truncate text-[11px] text-navy-100/50">{admin.email}</p>
      </div>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        aria-label="Log out"
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-navy-100/70 hover:bg-white/10 hover:text-white disabled:opacity-60"
      >
        {loggingOut ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <LogOut className="h-3.5 w-3.5" />
        )}
        Logout
      </button>
    </div>
  );
}
