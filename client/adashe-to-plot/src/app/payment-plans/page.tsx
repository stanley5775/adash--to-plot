import type { Metadata } from "next";
import { estates } from "@/data/estates";
import { estatePaymentPlans } from "@/data/payment-plans";
import { LAND_APPLICATION_FEE } from "@/data/application-fee";
import { ATI_PLUS_DISCOUNT_RATE } from "@/data/ati-members";
import { PaymentPlansSection } from "@/components/property/PaymentPlansSection";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Payment Plans",
  description:
    "Compare Adashè-to-Plot property payment plans — outright, 6, 12, 18 and 24 months — across The Thrive Estate and AMIO Vista Homes in Kuje, Abuja, plus the separate ₦15,000 Land Application fee and the ATI Plus 5% member discount.",
};

const faqs = [
  {
    q: "Is the ₦15,000 Land Application fee part of my payment plan?",
    a: "No. The Land Application fee is a separate, one-time fee of ₦15,000 paid when you submit a Land Application for a property — it is never added to your outright payment or any installment plan. See the Land Application page for details.",
  },
  {
    q: "Do all estates offer every payment plan?",
    a: "No. The Thrive Estate offers Outright, 6, 12, 18 and 24-month plans. AMIO Vista Homes currently offers only Outright and 6-month plans on its bungalow-with-penthouse homes.",
  },
  {
    q: "Is there interest on any plan?",
    a: "Outright and 6-month plans carry 0% interest across both estates. At The Thrive Estate, 12 and 18-month plans carry 9% interest, and the 24-month plan carries 11% interest, applied to the property price before it's split into equal monthly installments.",
  },
  {
    q: "Do ATI Plus members get a discount on payment plans?",
    a: `Yes. ATI Plus members receive a flat ${Math.round(ATI_PLUS_DISCOUNT_RATE * 100)}% discount on every property payment plan — outright or installment — across both estates, in addition to early access and priority support.`,
  },
  {
    q: "Will I be reminded before a payment is due?",
    a: "Yes. Once you're on a plan, your dashboard shows every upcoming installment and its due date, and you'll receive a reminder 5 days before each payment is due.",
  },
  {
    q: "Can I switch plans after I've started paying?",
    a: "Speak with your Adashè-to-Plot advisor on WhatsApp — plan changes are reviewed case by case and depend on the estate and property.",
  },
];

export default function PaymentPlansPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <span className="gold-rule mb-4 block" />
        <h1 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">Payment Plans</h1>
        <p className="mt-3 text-ink-500">
          Every Adashè-to-Plot plan is transparent from the first payment to the last, with no hidden charges. The
          ₦{LAND_APPLICATION_FEE.toLocaleString("en-NG")} Land Application fee is paid separately when you submit a{" "}
          <a href="/application" className="font-semibold text-navy-800 underline decoration-gold-400 underline-offset-2 hover:text-gold-600">
            Land Application
          </a>{" "}
          — it is never added to the figures below. ATI Plus members save an extra {Math.round(ATI_PLUS_DISCOUNT_RATE * 100)}% on every plan.
        </p>
      </div>

      {estates.map((estate) => {
        const plan = estatePaymentPlans.find((p) => p.estateId === estate.id);
        if (!plan) return null;
        return (
          <div key={estate.id} className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-navy-950">{estate.name}</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Illustrated on the estate&apos;s starting price of ₦{estate.startingPrice.toLocaleString("en-NG")}. Exact
                  figures are calculated per property on its details page.
                </p>
              </div>
              <Button href={`/estates/${estate.slug}`} variant="outline" size="sm">View {estate.name}</Button>
            </div>
            <div className="mt-6">
              <PaymentPlansSection price={estate.startingPrice} rates={plan.rates} />
            </div>
          </div>
        );
      })}

      <div className="mt-20 max-w-3xl">
        <h2 className="text-xl font-bold text-navy-950">Frequently Asked Questions</h2>
        <div className="mt-6 divide-y divide-navy-800/10 rounded-2xl border border-navy-800/10 bg-white">
          {faqs.map((faq) => (
            <details key={faq.q} className="group p-6">
              <summary className="cursor-pointer list-none text-sm font-semibold text-navy-950 marker:content-none">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
