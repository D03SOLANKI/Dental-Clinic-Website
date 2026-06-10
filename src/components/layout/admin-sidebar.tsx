import React from "react";
import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-full md:w-64 bg-text-primary text-text-inverse md:min-h-screen p-md flex flex-col shrink-0">
      <div className="font-display font-bold text-lg mb-md md:mb-xl text-primary-500 text-center md:text-left">Aura Dental Admin</div>
      <nav className="flex flex-row md:flex-col flex-wrap justify-center md:justify-start gap-x-md gap-y-xs md:gap-md text-xs md:text-sm text-text-muted flex-grow">
        <Link 
          href="/admin?tab=appointments" 
          className="cursor-pointer hover:text-text-inverse whitespace-nowrap transition-colors"
        >
          Dashboard
        </Link>
        <Link 
          href="/admin?tab=appointments" 
          className="cursor-pointer hover:text-text-inverse whitespace-nowrap transition-colors"
        >
          Appointments
        </Link>
        <Link 
          href="/admin?tab=doctors" 
          className="cursor-pointer hover:text-text-inverse whitespace-nowrap transition-colors"
        >
          Doctors
        </Link>
        <Link 
          href="/admin?tab=services" 
          className="cursor-pointer hover:text-text-inverse whitespace-nowrap transition-colors"
        >
          Services
        </Link>
        <Link 
          href="/admin?tab=blogs" 
          className="cursor-pointer hover:text-text-inverse whitespace-nowrap transition-colors"
        >
          Blog Posts
        </Link>
        <Link 
          href="/admin?tab=testimonials" 
          className="cursor-pointer hover:text-text-inverse whitespace-nowrap transition-colors"
        >
          Testimonials
        </Link>
        <Link 
          href="/admin?tab=messages" 
          className="cursor-pointer hover:text-text-inverse whitespace-nowrap transition-colors"
        >
          Contact Messages
        </Link>
        <Link 
          href="/admin?tab=subscribers" 
          className="cursor-pointer hover:text-text-inverse whitespace-nowrap transition-colors"
        >
          Newsletter Subscribers
        </Link>
        <Link 
          href="/admin?tab=settings" 
          className="cursor-pointer hover:text-text-inverse whitespace-nowrap transition-colors border-t border-slate-800 pt-sm md:pt-md mt-xs md:mt-sm"
        >
          Settings
        </Link>
      </nav>
      <div className="text-2xs md:text-xs text-text-muted mt-md md:mt-auto border-t border-slate-800 pt-sm md:pt-md text-center md:text-left">
        Logged in as Admin
      </div>
    </aside>
  );
}
