"use client";

import React, { useState } from "react";
import ServiceCard from "@/components/ui/service-card";
import { services } from "@/lib/mockData";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(services.map((s) => s.category)))];

  // Filter logic
  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-surface py-2xl lg:py-3xl px-md sm:px-lg min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Page Title */}
        <div className="text-center mb-2xl">
          <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
            Aura Dental Care Treatments
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-text-primary mt-md tracking-tight">
            Our Dental Services Catalog
          </h1>
          <p className="font-body text-sm sm:text-base text-text-secondary mt-sm max-w-xl mx-auto leading-relaxed">
            From routine checkups to custom cosmetic makeovers, explore our range of advanced digital dental solutions on SG Highway, Ahmedabad.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="bg-surface-subtle border border-surface-muted rounded-2xl p-lg mb-xl shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-md">
          {/* Category Pill Buttons */}
          <div className="flex flex-wrap gap-xs items-center">
            <span className="flex items-center gap-xs font-body text-xs font-bold text-text-secondary mr-sm uppercase tracking-wider">
              <SlidersHorizontal className="h-4 w-4 text-primary-500" />
              Filter By:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-md py-sm rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat
                    ? "bg-primary-500 text-text-inverse shadow-sm"
                    : "bg-surface border border-surface-muted text-text-secondary hover:bg-surface-subtle"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs shrink-0">
            <span className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search treatments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-surface-muted rounded-full py-sm pl-xl pr-md text-xs text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 shadow-sm"
            />
          </div>
        </div>

        {/* Services Cards Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filteredServices.map((service) => (
              <div key={service.id} className="h-full">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3xl bg-surface-subtle border border-surface-muted rounded-2xl">
            <p className="font-body text-base text-text-muted">
              No treatments found matching your criteria. Try adjusting your search query or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
