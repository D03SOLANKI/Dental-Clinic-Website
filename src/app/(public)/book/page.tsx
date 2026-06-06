import React, { Suspense } from "react";
import BookingForm from "@/components/forms/booking-form";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Book Appointment",
  description: "Book an online appointment slot for root canal treatments, invisible aligners, cosmetic scaling, and teeth whitening at SmileCraft clinic Navrangpura, Ahmedabad.",
};

function BookingLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-3xl gap-md">
      <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      <span className="font-body text-sm text-text-secondary">Loading Booking Wizard...</span>
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="bg-surface-subtle py-2xl lg:py-3xl px-md sm:px-lg min-h-screen flex flex-col justify-center">
      <div className="mx-auto max-w-2xl w-full">
        {/* Title */}
        <div className="text-center mb-xl">
          <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
            Online Scheduling
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-text-primary mt-md tracking-tight">
            Book Your Dental Appointment
          </h1>
          <p className="font-body text-sm text-text-secondary mt-sm max-w-md mx-auto leading-relaxed">
            Fill out the 3-step form to choose your treatment, doctor, date, and available time slot in Ahmedabad.
          </p>
        </div>

        {/* Suspense wrapper around BookingForm */}
        <Suspense fallback={<BookingLoader />}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
