"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Star, CheckCircle, User2, BookOpen } from "lucide-react";

interface CaseStudy {
  id: number;
  title: string;
  category: string;
  slug: string;
  dentistName: string;
  dentistSlug: string;
  serviceSlug: string;
  duration: string;
  complexity: "Moderate" | "Advanced" | "Complex";
  problem: string;
  solution: string;
  steps: string[];
  beforeImage: string;
  afterImage: string;
  patientReview: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Full-Arch Permanent Dental Implants Restoration",
    category: "Implantology",
    slug: "full-arch-implants",
    dentistName: "Dr. Aarav Mehta",
    dentistSlug: "dr-aarav-mehta",
    serviceSlug: "dental-implants",
    duration: "4 Months",
    complexity: "Complex",
    problem: "Patient presented with severe tooth loss and bone resorption in the upper jaw, leading to inability to chew and loss of smile confidence.",
    solution: "Performed computer-guided all-on-4 dental implant surgery with custom zirconium hybrid bridges under computerized, pain-free anesthesia.",
    steps: [
      "Digital smile design & surgical mapping",
      "Computer-guided implant placement",
      "Immediate temporary aesthetic bridges placement",
      "Final premium zirconium restoration delivery"
    ],
    beforeImage: "/images/gallery_1.png", // fallback aesthetic image
    afterImage: "/images/hero_dentist.png", // fallback aesthetic image
    patientReview: "Dr. Aarav and the SmileCraft team completely transformed my mouth. I can chew perfectly and laugh without hiding my face.",
  },
  {
    id: 2,
    title: "Invisalign Clear Aligner Therapy for Severe Crowding",
    category: "Orthodontics",
    slug: "invisalign-crowding",
    dentistName: "Dr. Riya Shah",
    dentistSlug: "dr-riya-shah",
    serviceSlug: "orthodontics",
    duration: "14 Months",
    complexity: "Advanced",
    problem: "Severe lower crowding and upper protrusion causing crossbite, speech friction, and difficulty maintaining plaque control.",
    solution: "Designed a series of 28 custom clear aligners using 3D intraoral digital scans to align the dental arches smoothly and pain-free.",
    steps: [
      "Iterative 3D progress modeling on high-res monitors",
      "Attachment placements & clear aligner custom fitting",
      "Bi-weekly aligner transitions & tracking checks",
      "Premium night retainer fitting"
    ],
    beforeImage: "/images/gallery_2.png",
    afterImage: "/images/hero_dentist.png",
    patientReview: "Nobody even noticed I was wearing aligners! My teeth are perfectly straight now, and flossing is so easy.",
  },
  {
    id: 3,
    title: "Cosmetic Veneers for Diastema and Discoloration",
    category: "Cosmetic Dentistry",
    slug: "cosmetic-veneers",
    dentistName: "Dr. Neha Desai",
    dentistSlug: "dr-neha-desai",
    serviceSlug: "cosmetic-veneers",
    duration: "2 Weeks",
    complexity: "Moderate",
    problem: "Midline diastema (gap between front teeth) accompanied by tetracycline stains resistant to chemical teeth whitening.",
    solution: "Placed 6 ultra-thin premium E-max porcelain veneers to close gaps, correct proportions, and establish a natural pearlescent white shade.",
    steps: [
      "Diagnostic mockup test of tooth proportions",
      "Conservative micro-preparation (under 0.3mm enamel shaving)",
      "Digital shade matching under full-spectrum medical lights",
      "Adhesion and bonding of E-max veneers"
    ],
    beforeImage: "/images/gallery_1.png",
    afterImage: "/images/hero_dentist.png",
    patientReview: "The E-max veneers look so natural! The gap is gone and my smile is radiant. The process was fast and entirely pain-free.",
  },
  {
    id: 4,
    title: "Laser Teeth Whitening for Stubborn Food Staining",
    category: "Teeth Whitening",
    slug: "laser-whitening",
    dentistName: "Dr. Kunal Patel",
    dentistSlug: "dr-kunal-patel",
    serviceSlug: "teeth-whitening",
    duration: "60 Minutes",
    complexity: "Moderate",
    problem: "Deep intrinsic staining from regular caffeine and tea consumption, affecting professional self-esteem.",
    solution: "Applied specialized hydrogen peroxide gel activated by zoom laser light, lifting stains by 8 full shades safely in one session.",
    steps: [
      "Polishing and gum barrier gel protection",
      "Dual-activation teeth whitening gel coating",
      "Laser photo-activation session",
      "Remineralising anti-sensitivity therapy"
    ],
    beforeImage: "/images/gallery_2.png",
    afterImage: "/images/hero_dentist.png",
    patientReview: "I walked in with yellow teeth and walked out with a bright white smile in just an hour. Excellent care!",
  },
];

export default function BeforeAfterPage() {
  const [selectedComplexity, setSelectedComplexity] = useState("All");

  const complexities = ["All", "Moderate", "Advanced", "Complex"];

  const filteredCases = caseStudies.filter(
    (c) => selectedComplexity === "All" || c.complexity === selectedComplexity
  );

  return (
    <div className="bg-surface-subtle py-2xl lg:py-3xl min-h-screen">
      {/* Header */}
      <section className="px-md sm:px-lg text-center mb-2xl">
        <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
          Smile Transformations
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-text-primary mt-md tracking-tight">
          Before & After Case Studies
        </h1>
        <p className="font-body text-sm sm:text-base text-text-secondary mt-sm max-w-xl mx-auto leading-relaxed">
          See the clinical evidence of our dental expertise. Real dental restoral cases and cosmetic smile makeovers performed at SmileCraft in Ahmedabad.
        </p>
      </section>

      {/* Filter Options */}
      <div className="flex justify-center gap-xs px-md mb-xl flex-wrap">
        {complexities.map((comp) => (
          <button
            key={comp}
            onClick={() => setSelectedComplexity(comp)}
            className={`px-md py-sm rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedComplexity === comp
                ? "bg-primary-500 text-text-inverse shadow-sm"
                : "bg-surface border border-surface-muted text-text-secondary hover:bg-surface-subtle"
            }`}
          >
            {comp}
          </button>
        ))}
      </div>

      {/* Case Studies Container */}
      <div className="max-w-6xl mx-auto px-md sm:px-lg space-y-2xl">
        {filteredCases.map((item) => (
          <article 
            key={item.id}
            className="bg-surface border border-surface-muted rounded-2xl p-xl shadow-card hover:shadow-card-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-xl"
          >
            {/* Visual before/after showcase wrapper */}
            <div className="lg:col-span-5 flex flex-col gap-md">
              <div className="relative h-[250px] w-full rounded-xl overflow-hidden border border-surface-muted shadow-sm">
                <Image
                  src={item.beforeImage}
                  alt={`Before treatment: ${item.title}`}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-md left-md bg-text-primary/80 text-text-inverse text-[10px] font-bold px-sm py-xs rounded-full uppercase tracking-wider">
                  Clinic Setting/Before
                </span>
              </div>
              <div className="relative h-[250px] w-full rounded-xl overflow-hidden border border-surface-muted shadow-sm">
                <Image
                  src={item.afterImage}
                  alt={`After treatment: ${item.title}`}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-md left-md bg-primary-600/90 text-text-inverse text-[10px] font-bold px-sm py-xs rounded-full uppercase tracking-wider">
                  Result/After
                </span>
              </div>
            </div>

            {/* Diagnostic Details */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-xs flex-wrap mb-md">
                  <span className="font-body text-xs font-semibold text-primary-600 bg-primary-50 px-sm py-xs rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className={`font-body text-xs font-semibold px-sm py-xs rounded-full uppercase tracking-wider ${
                    item.complexity === "Complex" 
                      ? "bg-rose-50 text-rose-600" 
                      : item.complexity === "Advanced" 
                      ? "bg-amber-50 text-amber-600" 
                      : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {item.complexity} Complexity
                  </span>
                </div>

                <h2 className="font-display text-2xl font-extrabold text-text-primary mb-md">
                  {item.title}
                </h2>

                <div className="space-y-md font-body text-sm text-text-secondary leading-relaxed">
                  <div>
                    <strong className="text-text-primary font-bold block mb-xs">Patient Condition:</strong>
                    <p>{item.problem}</p>
                  </div>
                  <div>
                    <strong className="text-text-primary font-bold block mb-xs">Treatment Strategy:</strong>
                    <p>{item.solution}</p>
                  </div>
                </div>

                {/* Treatment Steps list */}
                <div className="mt-xl">
                  <strong className="text-text-primary font-bold font-body text-sm block mb-sm">Clinical Steps Performed:</strong>
                  <ul className="space-y-xs">
                    {item.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-xs font-body text-xs text-text-secondary">
                        <CheckCircle className="h-4 w-4 text-accent-mint shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Doctor Assignment, Case Stats, Booking CTA */}
              <div className="mt-xl pt-lg border-t border-surface-muted flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-md">
                <div className="flex items-center gap-md">
                  <div className="h-10 w-10 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center shrink-0">
                    <User2 className="h-5 w-5" />
                  </div>
                  <div>
                    <Link
                      href={`/doctors/${item.dentistSlug}`}
                      className="font-display text-sm font-bold text-text-primary hover:text-primary-600 hover:underline block"
                    >
                      {item.dentistName}
                    </Link>
                    <span className="font-body text-xs text-text-muted flex items-center gap-xs mt-0.5">
                      <Clock className="h-3 w-3" /> Duration: {item.duration}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/book?service=${item.serviceSlug}&doctor=${item.dentistSlug}`}
                  className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-text-inverse font-body text-xs font-bold px-lg py-md rounded-md shadow-sm transition-all flex items-center justify-center gap-xs"
                >
                  Book Similar Treatment <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Patient review quote overlay at bottom */}
              <div className="mt-md bg-surface-subtle border border-surface-muted rounded-xl p-md flex items-start gap-xs">
                <span className="text-2xl text-primary-300 font-serif leading-none shrink-0">“</span>
                <blockquote className="font-body text-xs text-text-secondary italic">
                  {item.patientReview}
                  <span className="block mt-xs text-[10px] text-text-muted font-bold not-italic">— Verified Patient Review</span>
                </blockquote>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
