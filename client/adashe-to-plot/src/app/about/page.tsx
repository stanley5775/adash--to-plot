"use client";

import Image from "next/image";
import { Target, Eye, HeartHandshake, ShieldCheck } from "lucide-react";

import { useGetPublicStats } from "../../../hook/estates";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust",
    copy: "Every title is verified before it reaches our platform — no exceptions.",
  },
  {
    icon: HeartHandshake,
    title: "Transparency",
    copy: "Every naira is accounted for, from first payment to final allocation.",
  },
  {
    icon: Target,
    title: "Accessibility",
    copy: "Ownership shouldn't require a lump sum — that's why we built flexible plans.",
  },
  {
    icon: Eye,
    title: "Long-Term Value",
    copy: "We select locations for where they're heading, not just where they are.",
  },
];

export default function AboutPage() {
  const { data, isLoading, isError } = useGetPublicStats();

  const stats = data?.data;
  console.log(stats, "from about stats");
  return (
    <div>
      <section className="container-page py-16 sm:py-20">
        <div className="max-w-2xl">
          <span className="gold-rule mb-4 block" />

          <h1 className="text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            About Adashè-to-Plot
          </h1>

          <p className="mt-4 text-ink-500">
            Adashè-to-Plot makes verified property ownership more accessible,
            transparent, and achievable. We connect buyers with carefully
            sourced residential estates across Abuja, offering clearly defined
            plots, transparent pricing, flexible payment plans, and a structured
            journey from property discovery and inspection to application,
            payment, documentation, and allocation. Whether you're purchasing
            your first plot, securing land for your family, or growing your
            real-estate portfolio, Adashè-to-Plot gives you a clearer path to
            ownership—supported by verified opportunities and payment options
            designed to make property acquisition more manageable. **Find your
            plot. Plan your payments. Move closer to ownership.**
          </p>
        </div>

        {/* Public Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-navy-800/10 bg-white p-6 text-center"
              >
                <div className="mx-auto h-8 w-16 animate-pulse rounded-lg bg-navy-50" />

                <div className="mx-auto mt-2 h-3 w-24 animate-pulse rounded bg-navy-50" />
              </div>
            ))
          ) : isError ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-navy-800/10 bg-white p-6 text-center"
              >
                <p className="text-2xl font-bold text-navy-950">—</p>

                <p className="mt-1 text-xs uppercase tracking-wide text-ink-300">
                  {
                    [
                      "Estates",
                      "Property Types",
                      "Customers Onboarded",
                      "Years of Experience",
                    ][index]
                  }
                </p>
              </div>
            ))
          ) : (
            <>
              <div className="rounded-2xl border border-navy-800/10 bg-white p-6 text-center">
                <p className="text-2xl font-bold text-navy-950">
                  {stats?.estates ?? 0}
                </p>

                <p className="mt-1 text-xs uppercase tracking-wide text-ink-300">
                  Estates
                </p>
              </div>

              <div className="rounded-2xl border border-navy-800/10 bg-white p-6 text-center">
                <p className="text-2xl font-bold text-navy-950">
                  {stats?.propertyTypes ?? 0}
                </p>

                <p className="mt-1 text-xs uppercase tracking-wide text-ink-300">
                  Property Types
                </p>
              </div>

              <div className="rounded-2xl border border-navy-800/10 bg-white p-6 text-center">
                <p className="text-2xl font-bold text-navy-950">
                  {stats?.customersOnboarded ?? 0}+
                </p>

                <p className="mt-1 text-xs uppercase tracking-wide text-ink-300">
                  Customers Onboarded
                </p>
              </div>

              <div className="rounded-2xl border border-navy-800/10 bg-white p-6 text-center">
                <p className="text-2xl font-bold text-navy-950">
                  {stats?.yearsOfExperience ?? 0}
                </p>

                <p className="mt-1 text-xs uppercase tracking-wide text-ink-300">
                  Years of Experience
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-navy-50 py-20">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-navy-800/10 bg-white p-8">
            <Target className="h-8 w-8 text-gold-600" />

            <h2 className="mt-4 text-xl font-bold text-navy-950">
              Our Mission
            </h2>

            <p className="mt-3 text-ink-500">
              To give every Nigerian a verified, flexible path to property
              ownership — regardless of how much they can put down today.
            </p>
          </div>

          <div className="rounded-2xl border border-navy-800/10 bg-white p-8">
            <Eye className="h-8 w-8 text-gold-600" />

            <h2 className="mt-4 text-xl font-bold text-navy-950">Our Vision</h2>

            <p className="mt-3 text-ink-500">
              To become the most trusted digital platform for discovering,
              financing and owning verified residential property in Nigeria.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-20 sm:py-24">
        <div className="max-w-xl">
          <span className="gold-rule mb-4 block" />

          <h2 className="text-3xl font-bold tracking-tight text-navy-950">
            Our Values
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-navy-800/10 bg-white p-6"
            >
              <v.icon className="h-7 w-7 text-gold-600" />

              <h3 className="mt-4 text-base font-bold text-navy-950">
                {v.title}
              </h3>

              <p className="mt-2 text-sm text-ink-500">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
        <div className="absolute inset-0">
          <Image
            src="/images/thrive-6unit-flats.jpg"
            alt="Adashè-to-Plot development"
            fill
            className="object-cover opacity-20"
          />
        </div>

        <div className="container-page relative text-center">
          <h2 className="mx-auto max-w-xl text-2xl font-bold text-white sm:text-3xl">
            Why customers trust Adashè-to-Plot
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-navy-100/70">
            Verified documentation, transparent pricing, and a support team that
            stays with you from your first inspection to your final allocation.
          </p>
        </div>
      </section>
    </div>
  );
}
