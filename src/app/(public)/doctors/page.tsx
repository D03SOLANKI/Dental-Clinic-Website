"use client";

import React, { useState } from "react";
import DoctorCard from "@/components/ui/doctor-card";
import { doctors } from "@/lib/mockData";
import { SlidersHorizontal } from "lucide-react";

export default function DoctorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Extract unique specialties
  const specialties = ["All", ...Array.from(new Set(doctors.map((d) => d.specialty)))];

  // Filter logic
  const filteredDoctors = doctors.filter((doctor) => {
    return selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
  });

  return (
    <div className="bg-surface py-2xl lg:py-3xl px-md sm:px-lg min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Page Title */}
        <div className="text-center mb-2xl">
          <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
            Our Dental Specialists
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-text-primary mt-md tracking-tight">
            Meet Our Specialist Dentists
          </h1>
          <p className="font-body text-sm sm:text-base text-text-secondary mt-sm max-w-xl mx-auto leading-relaxed">
            Our clinic is led by highly certified MDS specialists who combine years of clinical expertise with advanced pain-free technologies.
          </p>
        </div>

        {/* Filters Container */}
        <div className="bg-surface-subtle border border-surface-muted rounded-2xl p-lg mb-xl shadow-card flex flex-wrap gap-xs items-center justify-center sm:justify-start">
          <span className="flex items-center gap-xs font-body text-xs font-bold text-text-secondary mr-sm uppercase tracking-wider">
            <SlidersHorizontal className="h-4 w-4 text-primary-500" />
            Specialty:
          </span>
          {specialties.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-md py-sm rounded-full text-xs font-semibold tracking-wide transition-all ${
                selectedSpecialty === spec
                  ? "bg-primary-500 text-text-inverse shadow-sm"
                  : "bg-surface border border-surface-muted text-text-secondary hover:bg-surface-subtle"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctors Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {/* Trust block */}
        <div className="mt-3xl bg-primary-50/50 border border-primary-100/50 rounded-2xl p-xl max-w-3xl mx-auto text-center flex flex-col items-center gap-md">
          <h3 className="font-display text-lg font-bold text-primary-950">
            Need consultation on which specialist you should consult?
          </h3>
          <p className="font-body text-sm text-primary-900 leading-relaxed max-w-xl">
            Our reception desk is open for immediate advice. Call us, outline your dental conditions, and we will pair you with the right root-canal, implant, or orthodontic expert.
          </p>
          <div className="flex flex-col sm:flex-row gap-md mt-xs">
            <a
              href="tel:+919876512345"
              className="bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-sm font-semibold px-xl py-md rounded-md transition-colors shadow-sm"
            >
              Call Clinic: +91 98765 12345
            </a>
            <a
              href="https://wa.me/919876512345"
              className="bg-emerald-600 hover:bg-emerald-700 text-text-inverse font-body text-sm font-semibold px-xl py-md rounded-md transition-colors shadow-sm flex items-center justify-center gap-xs"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
