"use client";

import {
  Star,
  Clock,
  Gift,
  HeartHandshake,
  ShieldCheck,
  Crown,
  Wallet,
  Percent,
} from "lucide-react";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { JoinAtiPlusButton } from "@/components/ati/JoinAtiPlusButton";
import { Badge, statusToTone } from "@/components/ui/Badge";

const benefits = [
  { icon: Percent, title: "5% Off Every Payment Plan" },
  { icon: Clock, title: "Early Access" },
  { icon: Gift, title: "Exclusive Offers" },
  { icon: Star, title: "Priority Inspection Scheduling" },
  { icon: HeartHandshake, title: "Dedicated Support" },
  { icon: ShieldCheck, title: "Special Payment Opportunities" },
  { icon: Crown, title: "Member-Only Investments" },
];

export default function DashboardAtiPlusPage() {
  const isAtiPlusMember = false;

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="ATI Plus"
        subtitle="Your membership status and benefits."
      />

      {/* Membership Status */}
      <div className="rounded-2xl border border-gold-400 bg-gold-50 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-gold-700">
          <Star className="h-5 w-5" />

          <span className="text-sm font-bold uppercase tracking-wide">
            ATI Plus Membership
          </span>
        </div>

        {isAtiPlusMember ? (
          <>
            <div className="mt-3 flex items-center gap-3">
              <h3 className="text-xl font-bold text-navy-950">
                Yes, you are an ATI Plus Member
              </h3>

              <Badge tone={statusToTone("Active")}>Active</Badge>
            </div>

            <p className="mt-2 text-sm text-ink-600">
              You have access to all ATI Plus membership benefits.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="flex items-center gap-3 rounded-xl bg-white p-4">
                    <Icon className="h-5 w-5 text-gold-600" />

                    <span className="text-sm font-medium text-navy-950">
                      {benefit.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h3 className="mt-3 text-xl font-bold text-navy-950">
              You are not an ATI Plus Member
            </h3>

            <p className="mt-2 max-w-md text-sm text-ink-600">
              Join ATI Plus to get early access, priority inspections, exclusive
              offers and dedicated support.
            </p>

            <div className="mt-5">
              <JoinAtiPlusButton />
            </div>
          </>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-base font-bold text-navy-950">
          ATI Plus Payment History
        </h3>

        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-800/10 bg-navy-50">
                  <th className="px-5 py-3 font-semibold text-ink-700">Date</th>

                  <th className="px-5 py-3 font-semibold text-ink-700">
                    Description
                  </th>

                  <th className="px-5 py-3 font-semibold text-ink-700">
                    Amount
                  </th>

                  <th className="px-5 py-3 font-semibold text-ink-700">
                    Status
                  </th>

                  <th className="px-5 py-3 font-semibold text-ink-700">
                    Reference
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="px-5 py-4 text-ink-700">Sep 01, 2026</td>

                  <td className="px-5 py-4 text-ink-700">
                    ATI Plus Subscription
                  </td>

                  <td className="px-5 py-4 font-semibold text-navy-950">
                    ₦20,000
                  </td>

                  <td className="px-5 py-4">
                    <Badge tone={statusToTone("Paid")}>Paid</Badge>
                  </td>

                  <td className="px-5 py-4 text-ink-500">ATI-PAY-001</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
