import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { doctors } from "@/lib/mockData";
import { generateSEO } from "@/lib/seo";
import { Award, Languages, Calendar, ChevronRight, CheckCircle2, Heart } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return doctors.map((doctor) => ({
    slug: doctor.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);

  if (!doctor) {
    return generateSEO({
      title: "Specialist Not Found",
      description: "The requested dentist profile could not be found.",
      path: `/doctors/${slug}`,
    });
  }

  return generateSEO({
    title: `${doctor.name} - ${doctor.specialty}`,
    description: doctor.bio,
    path: `/doctors/${doctor.slug}`,
  });
}

export default async function DoctorDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="bg-surface py-2xl lg:py-3xl px-md sm:px-lg min-h-screen">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-xs font-body text-xs font-semibold text-text-muted mb-xl">
          <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/doctors" className="hover:text-primary-500 transition-colors">Doctors</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-primary">{doctor.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Left Column: Photo & Sticky Card */}
          <div className="lg:col-span-4 space-y-md">
            <div className="bg-surface border border-surface-muted rounded-2xl overflow-hidden shadow-card-md">
              <div className="relative w-full h-[320px] bg-slate-100">
                <Image
                  src={doctor.photo_url}
                  alt={`Portrait of ${doctor.name}`}
                  fill
                  priority
                  sizes="(max-w-720px) 100vw, 30vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-lg flex flex-col gap-sm">
                <span className="bg-primary-50 text-primary-600 font-body text-xs font-bold px-md py-sm rounded-full w-fit uppercase tracking-wider">
                  {doctor.specialty}
                </span>
                <h1 className="font-display text-2xl font-bold text-text-primary mt-xs">
                  {doctor.name}
                </h1>
                <div className="flex items-center gap-xs text-xs text-text-secondary font-body mt-0.5">
                  <Award className="h-4 w-4 text-primary-500 shrink-0" />
                  <span>{doctor.qualifications.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface border border-surface-muted rounded-2xl p-lg shadow-card flex flex-col gap-sm">
              <Link
                href={`/book?doctor=${doctor.id}`}
                className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-text-inverse font-body text-sm font-semibold py-md rounded-md text-center shadow-card transition-all"
              >
                Book Appointment
              </Link>
              <a
                href="tel:+919876512345"
                className="border border-surface-muted hover:bg-surface-subtle text-text-secondary font-body text-sm font-semibold py-md rounded-md text-center transition-colors"
              >
                Call Clinic Desk
              </a>
            </div>
          </div>

          {/* Right Column: Bio details */}
          <div className="lg:col-span-8 space-y-xl">
            {/* Bio section */}
            <div className="space-y-md">
              <h2 className="font-display text-xl font-bold text-text-primary border-b border-surface-muted pb-sm">
                Professional Biography
              </h2>
              <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed">
                {doctor.bio}
              </p>
              <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed">
                With a patient-centric, empathetic approach to dentistry, {doctor.name} has built a reputation in Ahmedabad for gentle treatment methods. Focusing on premium patient comfort, they make sure each session is relaxing, detailed, and completely pain-free.
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-md">
              <div className="bg-surface-subtle border border-surface-muted rounded-xl p-md flex flex-col gap-xs">
                <div className="flex items-center gap-xs text-sm font-bold text-text-primary">
                  <Languages className="h-4 w-4 text-primary-500" />
                  <span>Languages Spoken</span>
                </div>
                <p className="font-body text-xs sm:text-sm text-text-secondary mt-xs leading-relaxed">
                  {doctor.languages.join(", ")}
                </p>
              </div>

              <div className="bg-surface-subtle border border-surface-muted rounded-xl p-md flex flex-col gap-xs">
                <div className="flex items-center gap-xs text-sm font-bold text-text-primary">
                  <Calendar className="h-4 w-4 text-primary-500" />
                  <span>Available Clinical Days</span>
                </div>
                <p className="font-body text-xs sm:text-sm text-text-secondary mt-xs leading-relaxed">
                  {doctor.available_days.join(", ")}
                </p>
              </div>
            </div>

            {/* Care Philosophy */}
            <div className="space-y-md pt-md">
              <h2 className="font-display text-xl font-bold text-text-primary border-b border-surface-muted pb-sm">
                Patient Care Philosophy
              </h2>
              <div className="grid grid-cols-1 gap-md">
                {[
                  {
                    title: "Advanced Biological Safety",
                    desc: "Strict adherence to modern Class-B autoclaving protocols to ensure zero cross-infection risks.",
                  },
                  {
                    title: "Empathetic Pain Management",
                    desc: "Utilizing digital, localized numbing tools to make procedures virtually sensation-free.",
                  },
                  {
                    title: "Full Treatment Clarity",
                    desc: "Outlining diagnoses using intraoral photography so patients understand treatment paths before proceeding.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-md bg-surface border border-surface-muted rounded-xl p-md hover:border-primary-100 transition-colors shadow-sm">
                    <div className="h-6 w-6 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-text-primary">
                        {item.title}
                      </h4>
                      <p className="font-body text-xs sm:text-sm text-text-secondary mt-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
