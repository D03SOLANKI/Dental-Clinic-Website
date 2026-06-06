"use client";

import { useEffect, useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/mockData";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isHovered || shouldReduceMotion) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(nextSlide, 5000);

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isHovered, shouldReduceMotion]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: shouldReduceMotion ? 0 : direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (direction: number) => ({
      x: shouldReduceMotion ? 0 : direction > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    nextSlide();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevSlide();
  };

  const currentTestimonial = testimonials[index];

  return (
    <section
      aria-label="Patient reviews"
      className="bg-surface-subtle py-2xl px-md sm:px-lg overflow-hidden border-y border-surface-muted/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-4xl text-center flex flex-col items-center gap-md">
        {/* Quote Icon */}
        <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 mb-xs">
          <Quote className="h-6 w-6 fill-current" />
        </div>

        {/* Section Title */}
        <div>
          <h2 className="font-display text-3xl font-extrabold text-text-primary tracking-tight">
            What Our Patients Say
          </h2>
          <p className="font-body text-sm text-text-secondary mt-sm">
            Read stories of trust, comfort, and beautiful transformations from the patients who love our care.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full min-h-[220px] flex items-center justify-center mt-md px-xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentTestimonial.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex flex-col items-center gap-sm"
            >
              {/* Stars */}
              <div className="flex justify-center text-amber-400 gap-xs" aria-label={`Rating: ${currentTestimonial.rating} out of 5 stars`}>
                {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="font-body text-base sm:text-lg text-text-secondary leading-relaxed italic max-w-2xl mt-xs">
                &ldquo;{currentTestimonial.review}&rdquo;
              </blockquote>

              {/* Author & Tags */}
              <div className="mt-xs">
                <cite className="font-display text-sm font-bold text-text-primary not-italic block">
                  {currentTestimonial.patient_name}
                </cite>
                <span className="font-body text-xs text-primary-600 font-semibold bg-primary-50 px-sm py-0.5 rounded-full mt-sm inline-block uppercase tracking-wider">
                  {currentTestimonial.service_name} • {currentTestimonial.doctor_name}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 border border-surface-muted bg-surface rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-subtle hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 shadow-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 border border-surface-muted bg-surface rounded-full flex items-center justify-center text-text-secondary hover:bg-surface-subtle hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 shadow-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-xs mt-sm" role="tablist" aria-label="Testimonial navigation dots">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.id}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-primary-500" : "w-2.5 bg-surface-muted hover:bg-text-muted"
              }`}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
