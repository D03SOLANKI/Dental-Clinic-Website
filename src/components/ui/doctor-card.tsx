"use client";

import Link from "next/link";
import Image from "next/image";
import { Doctor } from "@/lib/mockData";
import { Check, Languages, Award, Calendar } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <article className="group bg-surface border border-surface-muted hover:border-primary-100 rounded-xl overflow-hidden shadow-card hover:shadow-card-md transition-all duration-300 flex flex-col h-full">
      {/* Photo Container */}
      <div className="relative w-full h-[260px] bg-slate-100 overflow-hidden">
        <Image
          src={doctor.photo_url}
          alt={`Professional portrait of ${doctor.name}, ${doctor.specialty}`}
          fill
          sizes="(max-w-720px) 100vw, 25vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {/* Specialty Tag */}
        <span className="absolute bottom-md left-md bg-primary-500 text-text-inverse font-body text-xs font-bold px-md py-sm rounded-full shadow-md">
          {doctor.specialty}
        </span>
      </div>

      {/* Profile Details */}
      <div className="p-lg flex flex-col flex-grow gap-md">
        <div>
          <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-primary-600 transition-colors">
            {doctor.name}
          </h3>
          {/* Qualifications */}
          <div className="flex items-start gap-xs text-xs text-text-secondary font-body mt-xs">
            <Award className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
            <span>{doctor.qualifications.join(", ")}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="font-body text-sm text-text-secondary leading-relaxed line-clamp-2">
          {doctor.bio}
        </p>

        {/* Metadata grid */}
        <div className="space-y-xs pt-sm border-t border-surface-muted mt-auto">
          {/* Languages */}
          <div className="flex items-center gap-xs text-xs text-text-secondary font-body">
            <Languages className="h-4 w-4 text-primary-400 shrink-0" />
            <span>{doctor.languages.join(", ")}</span>
          </div>

          {/* Availability */}
          <div className="flex items-start gap-xs text-xs text-text-secondary font-body">
            <Calendar className="h-4 w-4 text-primary-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-text-primary">Availability:</span>
              <span className="block text-text-muted mt-0.5">
                {doctor.available_days.join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Action button bar */}
        <div className="grid grid-cols-2 gap-sm pt-sm mt-xs">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="flex items-center justify-center border border-primary-500 hover:bg-primary-50 text-primary-500 font-body text-xs font-bold py-md rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            View Profile
          </Link>
          <Link
            href={`/book?doctor=${doctor.slug}`}
            className="flex items-center justify-center gap-xs bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-text-inverse font-body text-xs font-bold py-md rounded-md shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            Book Slot
          </Link>
        </div>
      </div>
    </article>
  );
}
