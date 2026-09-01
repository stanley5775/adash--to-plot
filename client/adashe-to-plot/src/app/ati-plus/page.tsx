import type { Metadata } from "next";
import Image from "next/image";
import { Star, Clock, HeartHandshake, ShieldCheck, Gift, Crown, CheckCircle2, Percent } from "lucide-react";
import { JoinAtiPlusButton } from "@/components/ati/JoinAtiPlusButton";

export const metadata: Metadata = {
  title: "ATI Plus",
  description:
    "Join ATI Plus for a flat ₦15,000 annual subscription and get a 5% discount on every property payment plan, early access to new releases, priority inspection scheduling and dedicated support from Adashè-to-Plot.",
};

const benefits = [
  { icon: Percent, title: "5% Off Every Payment Plan", copy: "Members save 5% on outright and every installment plan, across both estates." },
  { icon: Clock, title: "Early Access", copy: "See newly released plots and phases before they go public." },
  { icon: Gift, title: "Exclusive Offers", copy: "Special pricing and bundled incentives reserved for members only." },
  { icon: Star, title: "Priority Inspection Scheduling", copy: "Jump the queue for guided estate and property visits." },
  { icon: HeartHandshake, title: "Dedicated Support", copy: "A named advisor for the lifetime of your membership." },
  { icon: ShieldCheck, title: "Special Payment Opportunities", copy: "Access to plan structures not available to the public." },
  { icon: Crown, title: "Member-Only Investments", copy: "Selected properties reserved exclusively for ATI Plus members." },
];

export default function AtiPlusPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <Image src="/images/thrive-3bed-penthouse.jpg" alt="ATI Plus membership" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/90 to-navy-950/50" />
        </div>
        <div className="container-page relative py-24 sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-300">
            <Star className="h-3.5 w-3.5" /> Premium Membership
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">ATI Plus</h1>
          <p className="mt-5 max-w-xl text-lg text-navy-100/80">
            ATI Plus gives members access to exclusive property opportunities, investment benefits and priority
            support — a faster, more direct path to property ownership, for a flat ₦15,000 annual subscription.
          </p>
          <div className="mt-8">
            <JoinAtiPlusButton />
          </div>
        </div>
      </section>

      <section className="container-page py-20 sm:py-24">
        <div className="max-w-xl">
          <span className="gold-rule mb-4 block" />
          <h2 className="text-3xl font-bold tracking-tight text-navy-950">Membership Benefits</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-2xl border border-navy-800/10 bg-white p-6">
              <b.icon className="h-7 w-7 text-gold-600" />
              <h3 className="mt-4 text-base font-bold text-navy-950">{b.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{b.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-gold-400 bg-gold-50 px-8 py-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-700">
            Annual Subscription
          </span>
          <p className="text-3xl font-bold text-navy-950">₦15,000 / year</p>
          <p className="max-w-md text-sm text-ink-700">
            A single flat subscription, paid before you join and renewed every 12 months, unlocks every ATI Plus
            benefit — no tier-based pricing, no hidden add-ons.
          </p>
        </div>
      </section>

      <section className="bg-navy-50 py-20 sm:py-24 mt-8">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy-950">Membership levels</h2>
            <p className="mt-3 text-ink-500">
              ATI Plus members are recognised at Silver, Gold or Platinum tier based on their portfolio with
              Adashè-to-Plot — every tier receives the full core benefit set above.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {["Silver — new members", "Gold — active investors with 1+ property", "Platinum — completed purchases & referral partners"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-ink-700">
                  <CheckCircle2 className="h-4 w-4 text-gold-600" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-navy-800/10 bg-white p-8 text-center">
            <Crown className="mx-auto h-10 w-10 text-gold-500" />
            <h3 className="mt-4 text-xl font-bold text-navy-950">Ready to join?</h3>
            <p className="mt-2 text-sm text-ink-500">Membership is ₦15,000 per year and takes less than two minutes to activate.</p>
            <div className="mt-6 flex justify-center">
              <JoinAtiPlusButton />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
