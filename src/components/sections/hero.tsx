"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const, // premium easeOutQuart
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-surface py-2xl lg:py-3xl px-md sm:px-lg">
      {/* Background soft ambient glow */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary-50/50 blur-3xl" />

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
        {/* Left Text Block */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start text-left gap-md"
        >
          {/* Tagline Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-xs bg-primary-50 text-primary-700 px-md py-sm rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm"
          >
            <ShieldCheck className="h-4 w-4 text-primary-500" />
            Aura Dental Care
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-primary leading-[1.1] tracking-tight"
          >
            Experience Refined <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              Dental Luxury.
            </span>{" "}
            <br />
            Smile with Confidence.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="font-body text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl"
          >
            At Aura Dental Care, we combine advanced digital dentistry with a gentle, pain-free approach to design your perfect smile. Experience world-class dental care in the heart of Ahmedabad.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md w-full sm:w-auto mt-xs"
          >
            <Link
              href="/book"
              className="flex items-center justify-center gap-xs bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-text-inverse font-body text-base font-semibold px-xl py-md rounded-md shadow-card transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              Book Appointment
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-center border border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 font-body text-base font-semibold px-xl py-md rounded-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              Take a Tour
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-md mt-sm pt-md border-t border-surface-muted w-full"
          >
            <div className="flex items-center gap-xs">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-8 w-8 rounded-full border-2 border-surface bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700"
                  >
                    {n}
                  </div>
                ))}
              </div>
              <span className="font-body text-xs sm:text-sm text-text-secondary">
                <span className="font-bold text-text-primary">12,000+</span> happy patients
              </span>
            </div>
            <div className="h-4 w-px bg-surface-muted hidden sm:block" />
            <div className="flex items-center gap-xs">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="font-body text-xs sm:text-sm text-text-secondary">
                <span className="font-bold text-text-primary">4.9★</span> Google Rating (2.5K reviews)
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Image Block */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-5 relative w-full h-[320px] sm:h-[450px] rounded-2xl overflow-hidden shadow-card-lg border border-surface-muted"
        >
          <Image
            src="/images/hero_dentist.png"
            alt="Aura Dental Care premium modern clinic interior with warm atmospheric lighting"
            fill
            priority
            sizes="(max-w-720px) 100vw, 40vw"
            className="object-cover"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-text-primary/10 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
