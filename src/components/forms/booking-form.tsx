"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { services, doctors, timeSlots } from "@/lib/mockData";
import { bookAppointmentAction } from "@/app/actions/booking";
import { Calendar, User, Phone, Mail, FileText, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";

// Form validation schema using Zod
const bookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a dental service"),
  doctorId: z.string().min(1, "Please select a dentist"),
  appointmentDate: z
    .string()
    .min(1, "Please choose an appointment date")
    .refine((dateStr) => {
      const selected = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "Appointment date must be in the future"),
  appointmentTime: z.string().min(1, "Please select a time slot"),
  patientName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  patientEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  patientPhone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => /^\+?[0-9\s-]{10,15}$/.test(val), "Please enter a valid phone number (e.g. +91 98765 43210)"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const doctorParam = searchParams.get("doctor");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    defaultValues: {
      serviceId: "",
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      notes: "",
    },
  });

  // Prefill service & doctor from URL query parameters if they match ID or slug
  useEffect(() => {
    if (serviceParam) {
      const foundService = services.find((s) => s.id === serviceParam || s.slug === serviceParam);
      if (foundService) {
        setValue("serviceId", foundService.id, { shouldValidate: true });
      }
    }
    if (doctorParam) {
      const foundDoctor = doctors.find((d) => d.id === doctorParam || d.slug === doctorParam);
      if (foundDoctor) {
        setValue("doctorId", foundDoctor.id, { shouldValidate: true });
      }
    }
  }, [serviceParam, doctorParam, setValue]);

  // Watch fields to render dynamic states
  const watchedService = watch("serviceId");
  const watchedDoctor = watch("doctorId");
  const watchedDate = watch("appointmentDate");
  const watchedTime = watch("appointmentTime");

  const selectedService = services.find((s) => s.id === watchedService);
  const selectedDoctor = doctors.find((d) => d.id === watchedDoctor);

  // Custom step navigation with validation checks
  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof BookingFormData> = [];

    if (step === 1) {
      fieldsToValidate = ["serviceId", "doctorId"];
    } else if (step === 2) {
      fieldsToValidate = ["appointmentDate", "appointmentTime"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: BookingFormData) => {
    setBookingError(null);
    try {
      const res = await bookAppointmentAction(data);
      if (res.success) {
        setSubmitted(true);
      } else {
        setBookingError(res.error || "Failed to book appointment. Please check availability and try again.");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setBookingError("An unexpected system error occurred. Please try again later.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-surface border border-surface-muted rounded-2xl p-xl shadow-card text-center max-w-xl mx-auto flex flex-col items-center gap-md py-3xl">
        <div className="h-16 w-16 bg-accent-mint/10 text-accent-mint rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="font-display text-2xl font-bold text-text-primary">
          Appointment Requested!
        </h3>
        <p className="font-body text-sm text-text-secondary leading-relaxed max-w-md">
          We have sent a confirmation email with slot details to your address. {selectedDoctor?.name || "Our team"} looks forward to seeing you.
        </p>
        <div className="bg-surface-subtle border border-surface-muted rounded-xl p-md text-left w-full mt-md font-body text-sm text-text-secondary space-y-xs">
          <div><strong className="text-text-primary">Service:</strong> {selectedService?.name}</div>
          <div><strong className="text-text-primary">Specialist:</strong> {selectedDoctor?.name}</div>
          <div><strong className="text-text-primary">Date:</strong> {watchedDate}</div>
          <div><strong className="text-text-primary">Time Slot:</strong> {watchedTime}</div>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setStep(1);
          }}
          className="mt-lg bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-sm font-semibold px-xl py-md rounded-md transition-colors"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-surface-muted rounded-2xl shadow-card overflow-hidden max-w-2xl mx-auto">
      {/* Urgency/Availability Banner */}
      <div className="bg-amber-50 border-b border-amber-100 px-lg py-sm flex items-center gap-xs text-xs text-amber-800 font-semibold justify-center">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span>Only 3 appointment slots remaining today for Ahmedabad clinic</span>
      </div>

      <div className="p-xl">
        {/* Step Progress Stepper */}
        <div className="flex items-center justify-between mb-xl font-body text-xs font-bold text-text-muted">
          <div className={`flex items-center gap-xs ${step >= 1 ? "text-primary-500" : ""}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-primary-500 bg-primary-50" : "border-surface-muted"}`}>1</span>
            <span className="hidden sm:inline">Treatment</span>
          </div>
          <div className="h-px bg-surface-muted flex-grow mx-md" />
          <div className={`flex items-center gap-xs ${step >= 2 ? "text-primary-500" : ""}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-primary-500 bg-primary-50" : "border-surface-muted"}`}>2</span>
            <span className="hidden sm:inline">Schedule</span>
          </div>
          <div className="h-px bg-surface-muted flex-grow mx-md" />
          <div className={`flex items-center gap-xs ${step >= 3 ? "text-primary-500" : ""}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-primary-500 bg-primary-50" : "border-surface-muted"}`}>3</span>
            <span className="hidden sm:inline">Contact Details</span>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-xl">
          
          {/* STEP 1: Treatment & Doctor */}
          {step === 1 && (
            <div className="space-y-md">
              <h2 className="font-display text-lg font-bold text-text-primary">Step 1: Select Service & Doctor</h2>
              <p className="font-body text-sm text-text-secondary leading-relaxed">
                Choose the dental service you require and select your preferred specialist dentist.
              </p>
              
              <div className="flex flex-col gap-xs">
                <label htmlFor="serviceId" className="font-body text-sm font-semibold text-text-primary">
                  Select Dental Service
                </label>
                <select
                  id="serviceId"
                  {...register("serviceId")}
                  className="w-full bg-surface border border-surface-muted rounded-md p-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">-- Choose a service --</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.price_range})
                    </option>
                  ))}
                </select>
                {errors.serviceId && (
                  <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.serviceId.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-xs mt-md">
                <label htmlFor="doctorId" className="font-body text-sm font-semibold text-text-primary">
                  Select Dentist
                </label>
                <select
                  id="doctorId"
                  {...register("doctorId")}
                  className="w-full bg-surface border border-surface-muted rounded-md p-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">-- Choose a doctor --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
                {errors.doctorId && (
                  <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.doctorId.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time */}
          {step === 2 && (
            <div className="space-y-md">
              <h2 className="font-display text-lg font-bold text-text-primary">Step 2: Choose Date & Time</h2>
              <p className="font-body text-sm text-text-secondary leading-relaxed">
                Select a convenient date and choice of available timing for your dental session.
              </p>

              <div className="flex flex-col gap-xs">
                <label htmlFor="appointmentDate" className="font-body text-sm font-semibold text-text-primary">
                  Choose Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="appointmentDate"
                    min={minDateString}
                    {...register("appointmentDate")}
                    className="w-full bg-surface border border-surface-muted rounded-md p-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                {errors.appointmentDate && (
                  <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.appointmentDate.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-xs mt-md">
                <span className="font-body text-sm font-semibold text-text-primary">
                  Available Slots
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm mt-sm">
                  {timeSlots.map((time) => {
                    const isSelected = watchedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setValue("appointmentTime", time, { shouldValidate: true })}
                        className={`py-md text-sm font-body font-semibold rounded-md border text-center transition-all ${
                          isSelected
                            ? "bg-primary-500 border-primary-500 text-text-inverse shadow-sm"
                            : "bg-surface border-surface-muted text-text-secondary hover:bg-surface-subtle"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
                {errors.appointmentTime && (
                  <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.appointmentTime.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Contact Info */}
          {step === 3 && (
            <div className="space-y-md">
              <h2 className="font-display text-lg font-bold text-text-primary">Step 3: Patient Information</h2>
              <p className="font-body text-sm text-text-secondary leading-relaxed">
                Provide your contact information so we can record your booking and send confirmation details.
              </p>

              <div className="flex flex-col gap-xs">
                <label htmlFor="patientName" className="font-body text-sm font-semibold text-text-primary">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    id="patientName"
                    placeholder="Enter your name"
                    {...register("patientName")}
                    className="w-full bg-surface border border-surface-muted rounded-md py-md pl-xl pr-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                {errors.patientName && (
                  <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.patientName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mt-md">
                <div className="flex flex-col gap-xs">
                  <label htmlFor="patientEmail" className="font-body text-sm font-semibold text-text-primary">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      id="patientEmail"
                      placeholder="name@example.com"
                      {...register("patientEmail")}
                      className="w-full bg-surface border border-surface-muted rounded-md py-md pl-xl pr-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  {errors.patientEmail && (
                    <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.patientEmail.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-xs">
                  <label htmlFor="patientPhone" className="font-body text-sm font-semibold text-text-primary">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      id="patientPhone"
                      placeholder="+91 98765 43210"
                      {...register("patientPhone")}
                      className="w-full bg-surface border border-surface-muted rounded-md py-md pl-xl pr-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  {errors.patientPhone && (
                    <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.patientPhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-xs mt-md">
                <label htmlFor="notes" className="font-body text-sm font-semibold text-text-primary">
                  Optional Notes
                </label>
                <div className="relative">
                  <span className="absolute left-md top-[18px] text-text-muted">
                    <FileText className="h-4 w-4" />
                  </span>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Provide any additional symptoms or details for your dentist..."
                    {...register("notes")}
                    className="w-full bg-surface border border-surface-muted rounded-md py-md pl-xl pr-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          {bookingError && (
            <div className="bg-accent-coral/10 border border-accent-coral/20 rounded-lg p-md text-sm text-accent-coral font-medium flex items-center gap-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{bookingError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-lg border-t border-surface-muted mt-lg">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-xs border border-surface-muted text-text-secondary hover:bg-surface-subtle font-body text-sm font-semibold px-lg py-md rounded-md transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-xs bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-sm font-semibold px-lg py-md rounded-md shadow-sm transition-all ml-auto"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-xs bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50 text-text-inverse font-body text-sm font-semibold px-xl py-md rounded-md shadow-card transition-all ml-auto"
              >
                {isSubmitting ? "Requesting..." : "Submit Booking"}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
