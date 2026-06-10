import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Heart, ShieldCheck, Eye, Smile, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Learn about Aura Dental Care, our values, advanced pain-free technologies, sterilisation practices, and modern facilities on SG Highway, Ahmedabad.",
};

export default function AboutPage() {
  const pillars = [
    {
      title: "Advanced Tech-First Workflows",
      desc: "We utilize low-radiation digital radiography, high-resolution intraoral scanning, and computerized treatment planners.",
      icon: Cpu,
    },
    {
      title: "Signature Pain-Free Dentistry",
      desc: "We've replaced scary metal needles with computerized localized anesthesia wands, making treatments completely sensation-free.",
      icon: Heart,
    },
    {
      title: "International Bio-Sterilisation",
      desc: "Our Class-B autoclave chambers run daily chemical validation tests to guarantee 100% sterile tools and consultation spaces.",
      icon: ShieldCheck,
    },
    {
      title: "Transparent Diagnostics",
      desc: "We project intraoral visual captures on screens above your chair. You see what we see, allowing you to make informed decisions.",
      icon: Eye,
    },
  ];

  return (
    <div className="bg-surface py-2xl lg:py-3xl min-h-screen">
      {/* 1. Page Header */}
      <section className="px-md sm:px-lg text-center mb-2xl">
        <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
          About Aura Dental Care
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-text-primary mt-md tracking-tight">
          Gentle Care. Confident Smiles.
        </h1>
        <p className="font-body text-sm sm:text-base text-text-secondary mt-sm max-w-xl mx-auto leading-relaxed">
          Founded in Ahmedabad, Aura Dental Care combines clinical excellence in dentistry with premium luxury patient care.
        </p>
      </section>

      {/* 2. Visual Story Showcase */}
      <section className="px-md sm:px-lg mb-3xl">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
          {/* Text block */}
          <div className="lg:col-span-6 space-y-md">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
              Redefining the Dental Experience
            </h2>
            <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed">
              We started Aura Dental Care with a simple realization: standard dental visits are outdated, intimidating, and often uncomfortable. We set out to change that by constructing a boutique dental studio on SG Highway, Ahmedabad that feels more like a relaxing lounge than a clinic.
            </p>
            <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed">
              Led by MDS prosthodontists, oral surgeons, and pediatric specialists, we offer customized care using digital workflows. This reduces procedure times by up to 50%, while ensuring beautiful, long-lasting aesthetic and restoration results.
            </p>
          </div>

          {/* Image Block */}
          <div className="lg:col-span-6 relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-card-lg border border-surface-muted">
            <Image
              src="/images/hero_dentist.png"
              alt="Aura Dental Care modern dental clinic treatment studio"
              fill
              sizes="(max-w-720px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. Core Pillars (Tech & Values) */}
      <section className="bg-surface-subtle border-y border-surface-muted py-2xl lg:py-3xl px-md sm:px-lg">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary">
              Our Core Clinical Pillars
            </h2>
            <p className="font-body text-sm text-text-secondary mt-sm max-w-md mx-auto">
              How we guarantee absolute comfort, diagnostic precision, and surgical safety during every visit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={i}
                  className="bg-surface border border-surface-muted rounded-xl p-lg shadow-card hover:shadow-card-md transition-shadow flex flex-col gap-sm"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-text-primary mt-xs">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Ahmedabad Clinic Details Section */}
      <section className="py-2xl px-md sm:px-lg">
        <div className="mx-auto max-w-4xl bg-surface border border-surface-muted rounded-2xl p-xl shadow-card flex flex-col sm:flex-row gap-xl items-center">
          <div className="relative w-full sm:w-1/3 h-[200px] rounded-xl overflow-hidden shrink-0">
            <Image
              src="/images/female_dentist.png"
              alt="Female Dentist at Aura Dental Care SG Highway"
              fill
              sizes="(max-w-720px) 100vw, 15vw"
              className="object-cover object-top"
            />
          </div>
          <div className="space-y-md flex-1 w-full">
            <h3 className="font-display text-xl font-bold text-text-primary">
              Our SG Highway Facility
            </h3>
            <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
              Located near Satellite Cross Road on SG Highway, our Ahmedabad clinic features quiet consultation chambers, dedicated biological instrument processing labs, and a child-friendly pediatric consultation suite. All rooms are equipped with HEPA biological filtration units.
            </p>
            <div className="flex flex-wrap gap-md text-xs font-semibold text-text-primary pt-xs">
              <span className="flex items-center gap-xs whitespace-nowrap"><Smile className="h-4 w-4 text-primary-500 shrink-0" /> Free Valet Parking</span>
              <span className="flex items-center gap-xs whitespace-nowrap"><ShieldCheck className="h-4 w-4 text-primary-500 shrink-0" /> Fully Wheelchair Accessible</span>
            </div>
            <div className="pt-sm flex gap-sm">
              <Link
                href="/book"
                className="bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-xs font-bold px-lg py-md rounded-md shadow-sm transition-all"
              >
                Schedule Visit
              </Link>
              <Link
                href="/contact"
                className="border border-surface-muted hover:bg-surface-subtle text-text-secondary font-body text-xs font-bold px-lg py-md rounded-md transition-all flex items-center justify-center gap-xs"
              >
                Get Directions <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
