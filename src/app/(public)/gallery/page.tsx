"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Eye, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: "Clinic & Lounge" | "Operatories & Tech" | "Clinical Team";
  caption: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/gallery_reception.png",
    alt: "SmileCraft Boutique Reception and Waiting Lounge",
    category: "Clinic & Lounge",
    caption: "Premium Reception & Lounge",
    description: "Designed like a luxury hospitality space to reduce dental anxiety, featuring warm lighting and aromatherapy.",
  },
  {
    id: 2,
    src: "/images/gallery_treatment.png",
    alt: "State-of-the-art Treatment Operatory at SmileCraft",
    category: "Operatories & Tech",
    caption: "Advanced Treatment Suite",
    description: "Fully digital operatory with orthopedic chair, high-res dental monitors, and intraoral cameras.",
  },
  {
    id: 3,
    src: "/images/hero_dentist.png",
    alt: "Active Treatment Studio with Modern Equipment",
    category: "Operatories & Tech",
    caption: "Clinical Operatory",
    description: "Clean, sterilised, HEPA-filtered treatment environment utilizing the latest digital dentistry tools.",
  },
  {
    id: 4,
    src: "/images/female_dentist.png",
    alt: "Our Dental Specialists",
    category: "Clinical Team",
    caption: "Our Dental Specialists",
    description: "Experienced, compassionate, and dedicated to providing personalized care for every patient.",
  },
  {
    id: 5,
    src: "/images/male_dentist.png",
    alt: "Expert Care You Can Trust",
    category: "Clinical Team",
    caption: "Expert Care You Can Trust",
    description: "Our team combines expertise with empathy to deliver exceptional dental care.",
  },
  {
    id: 6,
    src: "/images/female_dentist.png",
    alt: "Patient-Centered Approach",
    category: "Clinical Team",
    caption: "Patient-Centered Approach",
    description: "We focus on your comfort, health, and long-term smile wellness.",
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ["All", "Clinic & Lounge", "Operatories & Tech", "Clinical Team"];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  return (
    <div className="bg-surface py-2xl lg:py-3xl min-h-screen">
      {/* Page Header */}
      <section className="px-md sm:px-lg text-center mb-2xl">
        <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
          Clinic Visual Tour
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-text-primary mt-md tracking-tight">
          Explore Our State-of-the-Art Clinic
        </h1>
        <p className="font-body text-sm sm:text-base text-text-secondary mt-sm max-w-xl mx-auto leading-relaxed">
          Take a virtual walk through our modern boutique dental studio in Navrangpura, Ahmedabad. Discover our premium facilities and clean sterilization areas.
        </p>
      </section>

      {/* Category Navigation */}
      <div className="flex justify-center gap-xs px-md mb-xl flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-md py-sm rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === cat
                ? "bg-primary-500 text-text-inverse shadow-sm"
                : "bg-surface-subtle border border-surface-muted text-text-secondary hover:bg-surface-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-md sm:px-lg">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-surface-subtle border border-surface-muted hover:border-primary-100 shadow-card hover:shadow-card-md transition-all duration-300"
              >
                {/* Image Wrap */}
                <div className="relative h-[250px] w-full overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-w-720px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Glassmorphic hover overlay */}
                  <div className="absolute inset-0 bg-text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="h-12 w-12 rounded-full bg-surface/90 flex items-center justify-center text-primary-500 shadow-card transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Eye className="h-5 w-5" />
                    </div>
                  </div>
                  {/* Category Badge */}
                  <span className="absolute top-md left-md bg-surface/90 text-text-primary text-[10px] font-bold px-sm py-xs rounded-full uppercase tracking-wider shadow-sm">
                    {item.category}
                  </span>
                </div>

                {/* Text Description */}
                <div className="p-lg">
                  <h3 className="font-display text-base font-bold text-text-primary group-hover:text-primary-600 transition-colors">
                    {item.caption}
                  </h3>
                  <p className="font-body text-xs text-text-secondary mt-xs line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-text-primary/90 flex items-center justify-center p-md sm:p-lg backdrop-blur-sm"
          >
            {/* Close trigger outside */}
            <div className="absolute inset-0" onClick={() => setActiveItem(null)} />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-surface rounded-2xl overflow-hidden max-w-4xl w-full shadow-card-lg relative z-10 flex flex-col md:flex-row border border-surface-muted"
            >
              {/* Left Image container */}
              <div className="relative w-full md:w-3/5 h-[300px] sm:h-[400px] bg-slate-900 shrink-0">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Right content details */}
              <div className="p-lg flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between gap-md mb-md">
                    <span className="font-body text-xs font-semibold text-primary-600 bg-primary-50 px-sm py-xs rounded-full uppercase tracking-wider">
                      {activeItem.category}
                    </span>
                    <button
                      onClick={() => setActiveItem(null)}
                      className="h-8 w-8 rounded-full border border-surface-muted hover:bg-surface-subtle text-text-secondary flex items-center justify-center transition-colors"
                      aria-label="Close image popup"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="font-display text-xl font-bold text-text-primary mb-sm">
                    {activeItem.caption}
                  </h3>
                  <p className="font-body text-sm text-text-secondary leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>

                <div className="pt-md border-t border-surface-muted mt-lg flex items-center gap-xs text-xs text-text-muted font-body">
                  <ShieldCheck className="h-4 w-4 text-accent-mint" />
                  <span>Verified SmileCraft Facility Photo</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
