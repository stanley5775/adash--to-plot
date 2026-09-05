"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  Home,
  CreditCard,
  Users,
  Star,
  CalendarCheck,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/estates", label: "Estates", icon: Building2 },
  { href: "/admin/properties", label: "Properties", icon: Home },
  { href: "/admin/payment-plans", label: "Payment Plans", icon: CreditCard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/ati-plus", label: "ATI Plus Members", icon: Star },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/sales", label: "Sales", icon: BarChart3 },
];

export function AdminSidebar() {
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
                active ? "bg-white text-navy-950" : "text-navy-100/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
