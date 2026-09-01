import type { PlanDuration, PlanRate, ComputedPaymentPlan } from "@/types/payment-plan";
import { ATI_PLUS_DISCOUNT_RATE } from "@/data/ati-members";

/**
 * Computes a full payment plan breakdown for a given property price and plan duration.
 *
 * IMPORTANT: The ₦15,000 Land Application Fee is completely separate from property
 * payment plans (see src/services/application.service.ts and src/data/application-fee.ts)
 * and must NEVER be added here.
 *
 * ATI Plus members receive a flat 5% discount on the total payable, applied before
 * the amount is split into installments.
 */
export function computePaymentPlan(price: number, rate: PlanRate, isAtiPlusMember = false): ComputedPaymentPlan {
  const totalBeforeDiscount = Math.round(price * (1 + rate.interestRate));
  const atiPlusDiscount = isAtiPlusMember ? Math.round(totalBeforeDiscount * ATI_PLUS_DISCOUNT_RATE) : 0;
  const totalPayable = totalBeforeDiscount - atiPlusDiscount;

  if (rate.duration === 0) {
    return {
      duration: 0,
      interestRate: rate.interestRate,
      principal: price,
      totalBeforeDiscount,
      atiPlusDiscount,
      isAtiPlusMember,
      monthlyAmount: 0,
      firstPaymentAmount: totalPayable,
      totalPayable,
      installments: 1,
    };
  }

  const monthlyAmount = Math.round(totalPayable / rate.duration);

  return {
    duration: rate.duration,
    interestRate: rate.interestRate,
    principal: price,
    totalBeforeDiscount,
    atiPlusDiscount,
    isAtiPlusMember,
    monthlyAmount,
    firstPaymentAmount: monthlyAmount,
    totalPayable,
    installments: rate.duration,
  };
}

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
export function isWithinReminderWindow(dueDate: Date, today: Date, reminderDays = 5): boolean {
  const diff = daysBetween(today, dueDate);
  return diff >= 0 && diff <= reminderDays;
}

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export const PLAN_DURATIONS: PlanDuration[] = [0, 6, 12, 18, 24];

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
export function buildInstallmentSchedule(
  startDate: string,
  price: number,
  rate: PlanRate,
  paidCount: number,
  isAtiPlusMember = false,
  today: Date = new Date(),
  reminderDays = 5
): ScheduleRow[] {
  const plan = computePaymentPlan(price, rate, isAtiPlusMember);
  const start = new Date(startDate);
  const rows: ScheduleRow[] = [];

  for (let i = 1; i <= plan.installments; i++) {
    const dueDate = addMonths(start, i - 1);
    const amount = i === plan.installments ? plan.totalPayable - plan.monthlyAmount * (plan.installments - 1) : plan.monthlyAmount;
    let status: ScheduleRow["status"];
    if (i <= paidCount) {
      status = "Paid";
    } else if (dueDate.getTime() < today.getTime() && daysBetween(today, dueDate) < 0) {
      status = "Overdue";
    } else {
      status = "Upcoming";
    }
    const isReminderWindow = status !== "Paid" && status !== "Overdue" && isWithinReminderWindow(dueDate, today, reminderDays);
    if (isReminderWindow) status = "Due";
    rows.push({ number: i, dueDate, amount, status, isReminderWindow });
  }

  return rows;
}
