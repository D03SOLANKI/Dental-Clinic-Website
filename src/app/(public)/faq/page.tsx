import React from "react";
import FAQAccordion from "@/components/sections/faq-accordion";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about SmileCraft Dental Clinic's services, pain-free anesthesia, scheduling, sterilisation protocols, and location in Ahmedabad.",
};

export default function FAQPage() {
  return (
    <div className="bg-surface-subtle min-h-screen py-xl">
      <FAQAccordion />
    </div>
  );
}
