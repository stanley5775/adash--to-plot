import type { ReactNode } from "react";

export type BadgeTone = "available" | "reserved" | "sold" | "neutral" | "gold" | "info" | "success" | "warning" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  available: "bg-[#e7f5ec] text-status-available",
  reserved: "bg-[#fbf0dc] text-status-reserved",
  sold: "bg-[#f8e9e9] text-status-sold",
  neutral: "bg-navy-100 text-navy-700",
  gold: "bg-gold-100 text-gold-700",
  info: "bg-navy-100 text-navy-600",
  success: "bg-[#e7f5ec] text-status-available",
  warning: "bg-[#fbf0dc] text-status-reserved",
  danger: "bg-[#f8e9e9] text-status-sold",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

export function statusToTone(status: string): BadgeTone {
  const map: Record<string, BadgeTone> = {
    Available: "available",
    Reserved: "reserved",
    Sold: "sold",
    Paid: "success",
    Due: "warning",
    Upcoming: "neutral",
    Overdue: "danger",
    Pending: "warning",
    Confirmed: "info",
    Completed: "success",
    Cancelled: "danger",
    Active: "success",
    "In Arrears": "danger",
    "In Progress": "warning",
    Approved: "success",
    "On Hold": "neutral",
    Processing: "warning",
  };
  return map[status] ?? "neutral";
}
