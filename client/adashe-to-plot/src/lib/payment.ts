import type { PlanRate } from "@/types/payment-plan";

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function daysBetween(from: Date, to: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

/**
 * A payment reminder is sent 5 days before an installment's due date.
 * Returns true if `today` falls on or within that 5-day window before `dueDate`,
 * and the payment has not yet been made.
 */
export function isWithinReminderWindow(
  dueDate: Date,
  today: Date,
  reminderDays = 5,
): boolean {
  const diff = daysBetween(today, dueDate);
  return diff >= 0 && diff <= reminderDays;
}

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export interface ScheduleRow {
  number: number;
  dueDate: Date;
  amount: number;
  status: "Paid" | "Due" | "Overdue" | "Upcoming";
  isReminderWindow: boolean;
}

/**
 * Builds the full installment schedule for a payment plan, marking which
 * installments are already paid (based on how many payment records exist),
 * and flagging the next unpaid installment for a reminder if it falls
 * within the reminder window (5 days before its due date by default).
 */
