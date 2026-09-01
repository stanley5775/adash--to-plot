import { Star, Clock, Gift, HeartHandshake, ShieldCheck, Crown, Wallet, Percent } from "lucide-react";
import { getCurrentCustomer } from "@/services/customer.service";
import { getAtiMemberByName } from "@/services/ati.service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { JoinAtiPlusButton } from "@/components/ati/JoinAtiPlusButton";
import { Badge, statusToTone } from "@/components/ui/Badge";
import { formatDate, formatNaira } from "@/lib/payment";

const benefits = [
  { icon: Percent, title: "5% Off Every Payment Plan" },
  { icon: Clock, title: "Early Access" },
  { icon: Gift, title: "Exclusive Offers" },
  { icon: Star, title: "Priority Inspection Scheduling" },
  { icon: HeartHandshake, title: "Dedicated Support" },
  { icon: ShieldCheck, title: "Special Payment Opportunities" },
  { icon: Crown, title: "Member-Only Investments" },
];

export default async function DashboardAtiPlusPage() {
  const customer = await getCurrentCustomer();
  const member = customer.isAtiPlusMember ? await getAtiMemberByName(customer.name) : undefined;

  return (
    <div className="space-y-8">
      <DashboardHeader customer={customer} title="ATI Plus" subtitle="Your membership status and benefits." />

      {customer.isAtiPlusMember && member ? (
        <>
          <div className="rounded-2xl border border-gold-400 bg-gold-50 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-gold-700">
              <Star className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wide">Active ATI Plus Member</span>
            </div>
            <p className="mt-3 text-sm text-ink-700">Member since {formatDate(member.memberSince)} — {member.membershipLevel} tier</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div key={b.title} className="flex items-center gap-3 rounded-xl bg-white p-4">
                  <b.icon className="h-5 w-5 text-gold-600" />
                  <span className="text-sm font-medium text-navy-950">{b.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-navy-800/10 bg-white p-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-navy-950">
              <Wallet className="h-4 w-4 text-gold-600" /> Annual Subscription
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">Annual Fee</p>
                <p className="font-bold text-navy-950">{formatNaira(member.annualFee)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">Status</p>
                <Badge tone={statusToTone(member.subscriptionStatus)}>{member.subscriptionStatus}</Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">Renews On</p>
                <p className="font-bold text-navy-950">{formatDate(member.renewalDate)}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-500">
              ATI Plus membership is renewed automatically each year for a flat ₦{member.annualFee.toLocaleString("en-NG")} subscription fee.
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-navy-800/10 bg-white p-10 text-center">
          <Crown className="h-10 w-10 text-gold-500" />
          <h3 className="text-lg font-bold text-navy-950">You&apos;re not an ATI Plus member yet</h3>
          <p className="max-w-sm text-sm text-ink-500">
            Join ATI Plus for early access to new releases, priority inspections and dedicated support — for a flat
            ₦15,000 annual subscription.
          </p>
          <JoinAtiPlusButton />
        </div>
      )}
    </div>
  );
}
