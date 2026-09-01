import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Wallet,
  FileCheck2,
  MapPinned,
  Headset,
  TrendingUp,
  ArrowRight,
  Star,
} from "lucide-react";
import { estates } from "@/data/estates";
import { properties } from "@/data/properties";
import { Button } from "@/components/ui/Button";
import { EstateCard } from "@/components/estate/EstateCard";
import { PropertyCard } from "@/components/property/PropertyCard";
import { HeroSearch } from "@/components/home/HeroSearch";
import { WhatsAppButton } from "@/components/booking/WhatsAppButton";
import { formatNaira } from "@/lib/payment";

const whyUs = [
  { icon: ShieldCheck, title: "Verified Locations", copy: "Every estate is inspected and title-verified before it ever reaches our platform." },
  { icon: Wallet, title: "Flexible Payment Plans", copy: "Spread your investment from 6 to 24 months, or pay outright — your choice." },
  { icon: FileCheck2, title: "Secure Documentation", copy: "Survey plans, deeds and allocation letters are tracked from day one." },
  { icon: MapPinned, title: "Strategic Locations", copy: "We select estates along Abuja's fastest-growing residential corridors." },
  { icon: Headset, title: "Professional Support", copy: "A dedicated advisor guides you from inspection to allocation." },
  { icon: TrendingUp, title: "Investment Opportunities", copy: "Options built for owner-occupiers and yield-focused investors alike." },
];

const featuredProperties = [
  properties.find((p) => p.id === "thrive-3bed-penthouse")!,
  properties.find((p) => p.id === "thrive-4bed-semi-detached")!,
  properties.find((p) => p.id === "amio-2bed-bungalow")!,
  properties.find((p) => p.id === "thrive-fully-detached")!,
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          <Image
            src="/images/thrive-fully-detached.jpg"
            alt="A premium Adashè-to-Plot residence"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/85 to-navy-950/40" />
        </div>
        <div className="container-page relative flex flex-col gap-10 py-24 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <span className="gold-rule mb-6 block" />
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Own Your Plot.
              <br />
              Build Your Future.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100/80">
              Adashè-to-Plot helps you discover and invest in verified residential plots and premium homes across
              Abuja — with flexible payment plans and documentation you can trust, every step of the way.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/estates" size="lg">Explore Properties</Button>
              <Button href="/contact" variant="secondary" size="lg">Book an Inspection</Button>
            </div>
          </div>

          <HeroSearch />
        </div>
      </section>

      {/* Featured Estates */}
      <section className="container-page py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="gold-rule mb-4 block" />
            <h2 className="text-3xl font-bold tracking-tight text-navy-950">Featured Estates</h2>
            <p className="mt-2 max-w-lg text-ink-500">Two distinct communities in Kuje, Abuja — each built for a different kind of investor.</p>
          </div>
          <Link href="/estates" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-gold-600">
            View all estates <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {estates.map((estate) => (
            <EstateCard key={estate.id} estate={estate} />
          ))}
        </div>
      </section>

      {/* Why Adashe-to-Plot */}
      <section className="bg-navy-900 py-20 sm:py-24">
        <div className="container-page">
          <div className="max-w-xl">
            <span className="gold-rule mb-4 block" />
            <h2 className="text-3xl font-bold tracking-tight text-white">Why Adashè-to-Plot</h2>
            <p className="mt-2 text-navy-100/70">The fundamentals we don&apos;t compromise on, on every estate we bring to the platform.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <item.icon className="h-7 w-7 text-gold-400" />
                <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-navy-100/70">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container-page py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="gold-rule mb-4 block" />
            <h2 className="text-3xl font-bold tracking-tight text-navy-950">Featured Properties</h2>
            <p className="mt-2 max-w-lg text-ink-500">A cross-section of what&apos;s available right now across our estates.</p>
          </div>
        </div>
        <div className="mt-10">
          <PropertyGridHome />
        </div>
      </section>

      {/* Payment Plans */}
      <section className="bg-navy-50 py-20 sm:py-24">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="gold-rule mb-4 block" />
            <h2 className="text-3xl font-bold tracking-tight text-navy-950">Pay Small Small, Own a Property</h2>
            <p className="mt-4 text-ink-500">
              Choose outright payment or spread your investment over 6, 12, 18 or 24 months. Every plan is
              transparent from day one — your deposit, monthly amount, and total cost are laid out before you commit.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink-700">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> 0% interest on outright and 6-month plans</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> ATI Plus members save an extra 5% on every plan</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-500" /> Automatic reminders 5 days before every due date</li>
            </ul>
            <Button href="/payment-plans" variant="secondary" className="mt-8">See All Payment Plans</Button>
          </div>
          <div className="rounded-3xl border border-navy-800/10 bg-white p-8">
            <p className="text-xs uppercase tracking-wide text-ink-300">Example — 3 Bedroom Pent House</p>
            <p className="mt-1 text-2xl font-bold text-navy-950">{formatNaira(2700000)}</p>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-navy-800/10 pt-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">12 Months</p>
                <p className="font-semibold text-navy-950">9% interest</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">Monthly</p>
                <p className="font-semibold text-navy-950">₦245,250</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-300">ATI Plus Monthly</p>
                <p className="font-semibold text-gold-600">₦232,988</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-500">
              A separate ₦15,000 Land Application fee applies only when submitting a Land Application for this property.
            </p>
          </div>
        </div>
      </section>

      {/* ATI Plus */}
      <section className="container-page py-20 sm:py-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 p-10 sm:p-14">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-300">
                <Star className="h-3.5 w-3.5" /> ATI Plus Membership
              </span>
              <h2 className="mt-5 text-3xl font-bold text-white">Exclusive access. Priority everything.</h2>
              <p className="mt-3 text-navy-100/70">
                ATI Plus members get early access to new releases, priority inspection scheduling, and dedicated
                support — before properties reach the public, for a flat ₦15,000 annual subscription.
              </p>
            </div>
            <Button href="/ati-plus" size="lg">Become an ATI Plus Member</Button>
          </div>
        </div>
      </section>

      {/* Inspection CTA */}
      <section className="bg-navy-900 py-20 sm:py-24">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <span className="gold-rule" />
          <h2 className="max-w-xl text-3xl font-bold text-white">See it before you commit.</h2>
          <p className="max-w-lg text-navy-100/70">
            Book a guided inspection of any estate or property, or chat directly with an investment advisor on
            WhatsApp — right now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" size="lg">Book an Inspection</Button>
            <WhatsAppButton message="Hello Adashè-to-Plot, I'd like to book a property inspection." size="lg" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page py-20 text-center sm:py-28">
        <span className="gold-rule mx-auto mb-6 block" />
        <h2 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">Your Future Starts With Land.</h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-500">
          Explore verified estates, compare payment plans, and take the first step toward property ownership today.
        </p>
        <Button href="/estates" size="lg" className="mt-8">Explore Properties</Button>
      </section>
    </div>
  );
}

function PropertyGridHome() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featuredProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
