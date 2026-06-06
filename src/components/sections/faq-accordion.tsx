"use client";

import React, { useState } from "react";
import { faqs, FAQItem } from "@/lib/mockData";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQAccordion() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(faqs.map((faq) => faq.category)))];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-2xl bg-surface-subtle px-md sm:px-lg">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <div className="text-center mb-xl">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-sm sm:text-base text-text-secondary mt-sm max-w-xl mx-auto">
            Find answers to common questions about our dental services, technologies, scheduling, and comfort standards.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-md mb-xl">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-xs">
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
          <div className="relative flex-grow md:max-w-xs">
            <span className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-surface-muted rounded-full py-sm pl-xl pr-md text-xs text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* FAQ Grid/List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-sm">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-surface border border-surface-muted hover:border-primary-100 rounded-xl overflow-hidden shadow-card transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full flex items-center justify-between p-lg text-left font-display text-base font-bold text-text-primary hover:text-primary-600 transition-colors focus:outline-none focus:bg-primary-50/20"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`ml-md h-8 w-8 bg-surface-subtle text-text-secondary rounded-full flex items-center justify-center border border-surface-muted transform transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 bg-primary-50 text-primary-500 border-primary-100" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="p-lg pt-0 font-body text-sm text-text-secondary leading-relaxed border-t border-surface-muted/50 bg-surface-subtle/50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-xl bg-surface border border-surface-muted rounded-xl">
            <p className="font-body text-sm text-text-muted">
              No questions found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
