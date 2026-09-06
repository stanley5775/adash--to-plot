
"use client";

import { LogOut } from "lucide-react";

export function AdminSessionBar() {
  return (
    <div className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white">
          Admin User
        </p>

        <p className="truncate text-[11px] text-navy-100/50">
          admin@example.com
        </p>
      </div>

      <button
        type="button"
        aria-label="Log out"
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-navy-100/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </button>
    </div>
  );
}

