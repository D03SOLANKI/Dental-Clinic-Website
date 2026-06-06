"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitContactAction } from "@/app/actions/contact";
import { Phone, Mail, MapPin, Clock, MessageSquare, AlertCircle, CheckCircle2, User, FileText } from "lucide-react";

// Client-side Zod validation schema matching server validation
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => /^\+?[0-9\s-]{10,15}$/.test(val), "Please enter a valid phone number (e.g. +91 98765 43210)"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setContactError(null);
    try {
      const res = await submitContactAction(data);
      if (res.success) {
        setSubmitted(true);
        reset();
      } else {
        setContactError(res.error || "Failed to submit message. Please try again.");
      }
    } catch (err: any) {
      console.error("Contact error:", err);
      setContactError("An unexpected system error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-surface py-2xl lg:py-3xl px-md sm:px-lg min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-2xl">
          <span className="font-body text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-md py-sm rounded-full">
            Connect With Us
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-text-primary mt-md tracking-tight">
            Contact SmileCraft Clinic
          </h1>
          <p className="font-body text-sm sm:text-base text-text-secondary mt-sm max-w-xl mx-auto leading-relaxed">
            Have questions regarding appointments, treatments, or billing? Reach out to our receptionist desk or drop us a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2xl items-start">
          {/* Left Column: Details & Google Map */}
          <div className="lg:col-span-5 space-y-lg">
            {/* Contact details card */}
            <div className="bg-surface-subtle border border-surface-muted rounded-2xl p-xl shadow-card space-y-lg">
              <h3 className="font-display text-xl font-bold text-text-primary border-b border-surface-muted pb-md">
                Clinic Details
              </h3>

              <div className="space-y-md font-body text-sm text-text-secondary">
                {/* Phone */}
                <div className="flex items-start gap-md">
                  <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Call Reception Desk</h4>
                    <p className="mt-0.5">+91 98765 43210</p>
                    <p className="text-xs text-text-muted mt-0.5">Toll Free: +91 79 4000 5000</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-md">
                  <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Email Support</h4>
                    <p className="mt-0.5"><a href="mailto:info@smilecraftclinic.com" className="hover:underline">info@smilecraftclinic.com</a></p>
                    <p className="text-xs text-text-muted mt-0.5">Appointments: <a href="mailto:appointments@smilecraftclinic.com" className="hover:underline">appointments@smilecraftclinic.com</a></p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-md">
                  <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">SmileCraft Location</h4>
                    <p className="mt-0.5 leading-relaxed">
                      4, Ground Floor, Olive Arcade, Off CG Road, Navrangpura, Ahmedabad, Gujarat 380009
                    </p>
                  </div>
                </div>

                {/* Operating hours */}
                <div className="flex items-start gap-md">
                  <div className="h-9 w-9 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">Clinical Hours</h4>
                    <p className="mt-0.5">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                    <p className="text-xs text-accent-coral font-semibold mt-0.5">Emergency Desk: 24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed Container */}
            <div className="bg-surface border border-surface-muted rounded-2xl overflow-hidden shadow-card h-[280px] relative">
              <iframe
                title="SmileCraft Dental Clinic Navrangpura Ahmedabad Google Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.6966144888126!2d72.5583685!3d23.0349141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f501062cdb%3A0xc3ea125139046c87!2sCG%20Rd%2C%20Navrangpura%2C%20Ahmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1716388910000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-surface border border-surface-muted rounded-2xl p-xl shadow-card text-center flex flex-col items-center gap-md py-3xl">
                <div className="h-16 w-16 bg-accent-mint/10 text-accent-mint rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="font-display text-2xl font-bold text-text-primary">
                  Inquiry Submitted!
                </h3>
                <p className="font-body text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
                  Thank you for writing to us. Our administrative desk will review your details and contact you via email or phone within the next 2 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-md bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-sm font-semibold px-xl py-md rounded-md transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <div className="bg-surface border border-surface-muted rounded-2xl p-xl shadow-card">
                <h3 className="font-display text-xl font-bold text-text-primary border-b border-surface-muted pb-md mb-lg">
                  Submit Feedback or Inquiry
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
                  {contactError && (
                    <div className="bg-accent-coral/10 border border-accent-coral/20 rounded-lg p-md text-sm text-accent-coral font-medium flex items-center gap-xs">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{contactError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div className="flex flex-col gap-xs">
                    <label htmlFor="name" className="font-body text-sm font-semibold text-text-primary">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        {...register("name")}
                        className="w-full bg-surface border border-surface-muted rounded-md py-md pl-xl pr-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    {errors.name && (
                      <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email and Phone grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    {/* Email */}
                    <div className="flex flex-col gap-xs">
                      <label htmlFor="email" className="font-body text-sm font-semibold text-text-primary">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
                          <Mail className="h-4 w-4" />
                        </span>
                        <input
                          type="email"
                          id="email"
                          placeholder="name@example.com"
                          {...register("email")}
                          className="w-full bg-surface border border-surface-muted rounded-md py-md pl-xl pr-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      {errors.email && (
                        <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-xs">
                      <label htmlFor="phone" className="font-body text-sm font-semibold text-text-primary">
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-md top-1/2 -translate-y-1/2 text-text-muted">
                          <Phone className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          id="phone"
                          placeholder="+91 98765 43210"
                          {...register("phone")}
                          className="w-full bg-surface border border-surface-muted rounded-md py-md pl-xl pr-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      {errors.phone && (
                        <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-xs">
                    <label htmlFor="message" className="font-body text-sm font-semibold text-text-primary">
                      Your Message
                    </label>
                    <div className="relative">
                      <span className="absolute left-md top-[18px] text-text-muted">
                        <MessageSquare className="h-4 w-4" />
                      </span>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Write your symptoms, queries, or custom booking requests..."
                        {...register("message")}
                        className="w-full bg-surface border border-surface-muted rounded-md py-md pl-xl pr-md text-sm text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    {errors.message && (
                      <p role="alert" className="text-xs text-accent-coral font-medium flex items-center gap-xs mt-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-xs bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-text-inverse font-body text-sm font-semibold py-md rounded-md shadow-card transition-all"
                  >
                    {isSubmitting ? "Sending message..." : "Send Message"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
