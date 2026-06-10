import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import * as Icons from "lucide-react";
import { services } from "@/lib/mockData";
import { generateSEO } from "@/lib/seo";
import { Clock, Tag, Calendar, ChevronRight, CheckCircle2, ShieldAlert } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return generateSEO({
      title: "Service Not Found",
      description: "The requested dental service could not be found.",
      path: `/services/${slug}`,
    });
  }

  return generateSEO({
    title: `${service.name} - Treatments`,
    description: service.short_description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[service.icon_name] || Icons.Activity;

  // Render dummy procedure steps based on the service
  const steps = [
    { title: "1. Diagnostic Scan", desc: "Digital high-resolution intraoral capture to verify internal root formations." },
    { title: "2. Treatment Plan", desc: "Detailed discussion of options, timelines, and pain-free anesthetic requirements." },
    { title: "3. Precision Procedure", desc: "Micro-dentistry treatment under high sterilization and safety protocols." },
    { title: "4. Recovery & Guidance", desc: "Personalized post-session directives and calendar invites for follow-ups." },
  ];

  return (
    <div className="bg-surface py-2xl lg:py-3xl px-md sm:px-lg min-h-screen">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-xs font-body text-xs font-semibold text-text-muted mb-xl">
          <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/services" className="hover:text-primary-500 transition-colors">Services</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-primary">{service.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-xl">
            {/* Header section */}
            <div className="flex items-start gap-md pb-xl border-b border-surface-muted">
              <div className="h-16 w-16 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center shrink-0">
                <IconComponent className="h-8 w-8" />
              </div>
              <div>
                <span className="font-body text-xs font-bold text-primary-600 bg-primary-50 px-md py-sm rounded-full uppercase tracking-wider">
                  {service.category}
                </span>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary mt-sm">
                  {service.name}
                </h1>
                <p className="font-body text-sm text-text-secondary mt-sm leading-relaxed max-w-2xl">
                  {service.short_description}
                </p>
              </div>
            </div>

            {/* Treatment description */}
            <div className="space-y-md">
              <h2 className="font-display text-xl font-bold text-text-primary">About the Treatment</h2>
              <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed">
                {service.long_description}
              </p>
              <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed">
                Our clinic in Ahmedabad leverages state-of-the-art diagnostic cameras and quiet micro-motors to deliver this treatment. This guarantees a quiet, soothing procedure with minimum chair-time and zero post-treatment discomfort.
              </p>
            </div>

            {/* Treatment Steps */}
            <div className="space-y-md pt-md">
              <h2 className="font-display text-xl font-bold text-text-primary">Procedure Workflow</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mt-sm">
                {steps.map((step, index) => (
                  <div key={index} className="bg-surface-subtle border border-surface-muted rounded-xl p-md flex flex-col gap-xs hover:border-primary-100 transition-colors">
                    <h4 className="font-display text-sm font-bold text-text-primary">{step.title}</h4>
                    <p className="font-body text-xs text-text-secondary leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Hygiene Policy Banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-md flex gap-md items-start">
              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="font-body">
                <h4 className="text-emerald-900 text-sm font-bold">100% Sterile Consultation Guarantee</h4>
                <p className="text-emerald-800 text-xs mt-xs leading-relaxed">
                  Aura Dental Care operates Class-B biological sterilisation monitors and single-use diagnostic barrier films, meeting international health and safety guidelines.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Widget */}
          <div className="lg:col-span-4 space-y-md">
            <div className="bg-surface border border-surface-muted rounded-2xl p-lg shadow-card-md flex flex-col gap-lg sticky top-28">
              <h3 className="font-display text-lg font-bold text-text-primary border-b border-surface-muted pb-md">
                Treatment Summary
              </h3>

              <div className="space-y-md font-body text-sm text-text-secondary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-xs">
                    <Clock className="h-4 w-4 text-primary-400" />
                    <span>Duration:</span>
                  </div>
                  <span className="font-bold text-text-primary">{service.duration_minutes} minutes</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-xs">
                    <Tag className="h-4 w-4 text-primary-400" />
                    <span>Price Range:</span>
                  </div>
                  <span className="font-bold text-primary-600">{service.price_range}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-xs">
                    <Calendar className="h-4 w-4 text-primary-400" />
                    <span>Availability:</span>
                  </div>
                  <span className="font-bold text-text-primary">Monday - Saturday</span>
                </div>
              </div>

              <div className="border-t border-surface-muted pt-md flex flex-col gap-sm">
                <Link
                  href={`/book?service=${service.id}`}
                  className="bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-text-inverse font-body text-sm font-semibold py-md rounded-md text-center shadow-card transition-all"
                >
                  Book This Treatment
                </Link>
                <a
                  href="tel:+919876512345"
                  className="border border-surface-muted hover:bg-surface-subtle text-text-secondary font-body text-sm font-semibold py-md rounded-md text-center transition-colors"
                >
                  Call Clinic Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
