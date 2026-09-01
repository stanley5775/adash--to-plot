"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Home,
  Wallet,
  FileText,
  CalendarCheck,
  FolderOpen,
  Star,
  User,
  Settings,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/properties", label: "My Properties", icon: Home },
  { href: "/dashboard/payments", label: "Payments", icon: Wallet },
  { href: "/dashboard/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/inspections", label: "Inspections", icon: CalendarCheck },
  { href: "/dashboard/documents", label: "Documents", icon: FolderOpen },
  { href: "/dashboard/ati-plus", label: "ATI Plus", icon: Star },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:w-64 lg:shrink-0">
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors lg:shrink ${
                active ? "bg-navy-950 text-white" : "text-ink-700 hover:bg-navy-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        <span className="mt-2 hidden items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink-300 lg:flex">
          <User className="h-4 w-4" /> Profile
        </span>
        <span className="hidden items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink-300 lg:flex">
          <Settings className="h-4 w-4" /> Settings
        </span>
      </nav>
    </aside>
  );
}
