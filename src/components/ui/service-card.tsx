"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { Service } from "@/lib/mockData";
import { ArrowRight, Clock, Tag } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Dynamically resolve Lucide icons based on icon_name
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[service.icon_name] || Icons.Activity;

  return (
    <article className="group relative bg-surface border border-surface-muted hover:border-primary-100 rounded-xl p-lg shadow-card hover:shadow-card-md transition-all duration-300 flex flex-col justify-between h-full transform hover:-translate-y-1">
      <div>
        {/* Category & Icon */}
        <div className="flex items-center justify-between mb-md">
          <span className="font-body text-xs font-semibold text-primary-600 bg-primary-50 px-sm py-xs rounded-full uppercase tracking-wider">
            {service.category}
          </span>
          <div className="h-10 w-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center group-hover:bg-primary-500 group-hover:text-text-inverse transition-colors duration-300">
            <IconComponent className="h-5 w-5" />
          </div>
        </div>

        {/* Name */}
        <h3 className="font-display text-lg font-bold text-text-primary mb-sm group-hover:text-primary-600 transition-colors">
          {service.name}
        </h3>

        {/* Short Description */}
        <p className="font-body text-sm text-text-secondary leading-relaxed mb-md">
          {service.short_description}
        </p>
      </div>

      {/* Metadata & Actions */}
      <div className="pt-md border-t border-surface-muted flex flex-col gap-sm mt-auto">
        <div className="flex items-center justify-between text-xs text-text-muted font-body">
          <div className="flex items-center gap-xs">
            <Clock className="h-4 w-4 text-primary-400" />
            <span>{service.duration_minutes} mins</span>
          </div>
          <div className="flex items-center gap-xs">
            <Tag className="h-4 w-4 text-primary-400" />
            <span>{service.price_range}</span>
          </div>
        </div>

        <Link
          href={`/services/${service.slug}`}
          className="flex items-center gap-xs text-sm font-semibold text-primary-500 group-hover:text-primary-600 transition-colors mt-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm w-fit"
          aria-label={`Learn more about ${service.name}`}
        >
          Learn More
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
