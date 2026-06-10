import Link from "next/link";
import Hero from "@/components/sections/hero";
import ServiceCard from "@/components/ui/service-card";
import DoctorCard from "@/components/ui/doctor-card";
import TestimonialsCarousel from "@/components/sections/testimonials-carousel";
import FAQAccordion from "@/components/sections/faq-accordion";
import { services, doctors } from "@/lib/mockData";
import { Smile, Award, Activity, Star, ShieldCheck, ArrowRight } from "lucide-react";

export default function HomePage() {
  // Select first 4 services as featured
  const featuredServices = services.slice(0, 4);

  const stats = [
    {
      value: "12,000+",
      label: "Happy Smiles Designed",
      description: "Patients treated on SG Highway, Ahmedabad",
      icon: Smile,
    },
    {
      value: "15+",
      label: "Years Clinical Excellence",
      description: "Proven expertise in advanced dentistry",
      icon: Award,
    },
    {
      value: "99.8%",
      label: "Treatment Success Rate",
      description: "Top-tier safety and hygiene protocols",
      icon: Activity,
    },
    {
      value: "4.9★",
      label: "Patient Satisfaction",
      description: "Rated highly across Google & local platforms",
      icon: Star,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Block */}
      <Hero />

      {/* 2. Key Stats Block */}
      <section className="bg-surface-subtle border-y border-surface-muted py-xl px-md sm:px-lg">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-surface border border-surface-muted rounded-xl p-lg shadow-card flex items-start gap-md hover:shadow-card-md transition-shadow"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-extrabold text-text-primary">
                      {stat.value}
                    </div>
                    <div className="font-body text-sm font-bold text-text-primary mt-xs">
                      {stat.label}
                    </div>
                    <div className="font-body text-xs text-text-secondary mt-0.5">
                      {stat.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Services Catalog */}
      <section className="py-2xl lg:py-3xl px-md sm:px-lg bg-surface">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-md mb-xl">
            <div>
              <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
                Our Treatments
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary mt-md">
                Featured Dental Services
              </h2>
              <p className="font-body text-sm sm:text-base text-text-secondary mt-sm max-w-xl">
                Experience world-class treatment protocols backed by leading-edge digital technologies in a highly hygienic, relaxing environment.
              </p>
            </div>
            <Link
              href="/services"
              className="flex items-center gap-xs font-body text-sm font-bold text-primary-500 hover:text-primary-600 hover:underline transition-colors shrink-0 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
            >
              View All Services
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Luxury Technology & Core Values */}
      <section className="py-2xl lg:py-3xl px-md sm:px-lg bg-surface-subtle border-y border-surface-muted">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
          <div>
            <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
              Standard of Care
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary mt-md">
              Where Technology Meets Gentle Care
            </h2>
            <p className="font-body text-sm sm:text-base text-text-secondary mt-md leading-relaxed">
              At Aura Dental Care, we refuse to practice outdated dental workflows. We understand that visiting a dentist can be anxiety-inducing, which is why we’ve completely redesigned the patient experience around luxury comfort and pain-free solutions.
            </p>

            {/* Bullets */}
            <div className="mt-xl space-y-md">
              {[
                {
                  title: "Ultra-Safe Digital Imaging",
                  desc: "Low-radiation digital X-rays and detailed intraoral 3D scans for immediate diagnosis with maximum safety.",
                },
                {
                  title: "Advanced Pain-Free Anesthesia",
                  desc: "Wand-assisted computerized anesthetic delivery that targets specific teeth without numbing your entire face.",
                },
                {
                  title: "Class-B Autoclave Sterilization",
                  desc: "Strict international biological monitoring standards ensuring 100% sterile instruments for every session.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-md">
                  <div className="h-6 w-6 rounded-full bg-accent-mint/10 text-accent-mint flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
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

          {/* Right visual showcase */}
          <div className="bg-surface border border-surface-muted rounded-2xl p-xl shadow-card-md flex flex-col gap-lg max-w-lg lg:max-w-none mx-auto lg:mr-0 w-full">
            <h3 className="font-display text-xl font-bold text-text-primary border-b border-surface-muted pb-md">
              Aura Dental Care Facility
            </h3>
            <div className="space-y-md font-body text-sm text-text-secondary">
              <div className="flex justify-between gap-md items-start">
                <span className="shrink-0">Address</span>
                <span className="font-semibold text-text-primary text-right">SG Highway, Ahmedabad</span>
              </div>
              <div className="flex justify-between gap-md items-start">
                <span className="shrink-0">Operating Hours</span>
                <span className="font-semibold text-text-primary text-right">Mon - Sat: 9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between gap-md items-start">
                <span className="shrink-0">Emergency Support</span>
                <span className="font-semibold text-accent-coral text-right">24/7 Available</span>
              </div>
              <div className="flex justify-between gap-md items-start">
                <span className="shrink-0">Contact Desk</span>
                <span className="font-semibold text-text-primary text-right">+91 98765 12345</span>
              </div>
            </div>
            <Link
              href="/about"
              className="mt-md bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-sm font-semibold py-md rounded-md text-center shadow-card transition-all"
            >
              Explore Our Clinic Facilities
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Meet Specialists Dentist Team */}
      <section className="py-2xl lg:py-3xl px-md sm:px-lg bg-surface">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-xl">
            <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
              Our Dental Specialists
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary mt-md">
              Meet Our Expert Dentists
            </h2>
            <p className="font-body text-sm sm:text-base text-text-secondary mt-sm max-w-xl mx-auto">
              Our team consists of highly skilled BDS and MDS specialists dedicated to providing top-tier cosmetic, implant, orthodontic, and pediatric care.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Carousel Block */}
      <TestimonialsCarousel />

      {/* 7. FAQ Accordion Block */}
      <FAQAccordion />

      {/* 8. Call to Action Banner */}
      <section className="bg-primary-700 text-text-inverse py-2xl px-md sm:px-lg text-center relative overflow-hidden">
        {/* Decorative backdrop blobs */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary-600/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary-500/30 blur-3xl" />

        <div className="mx-auto max-w-3xl relative z-10 flex flex-col items-center gap-md">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Experience Aura Dental Care's Luxury Care?
          </h2>
          <p className="font-body text-base text-primary-100 max-w-xl">
            Book your convenient slot online today. Enjoy gentle checkups, expert cosmetic dental cleanings, and modern pain-free treatments right in Ahmedabad.
          </p>
          <div className="flex flex-col sm:flex-row gap-md w-full sm:w-auto mt-sm">
            <Link
              href="/book"
              className="bg-surface text-primary-700 hover:bg-primary-50 active:bg-primary-100 font-body text-base font-bold px-xl py-md rounded-md shadow-card transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-surface"
            >
              Book Your Appointment Now
            </Link>
            <a
              href="tel:+919876512345"
              className="border border-primary-300 hover:bg-primary-600 font-body text-base font-bold px-xl py-md rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-300"
            >
              Call Clinic Desk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
