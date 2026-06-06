# Product Specification: SmileCraft Dental Clinic & Admin Management

This document defines the functional requirements, design aesthetics, user flows, database architecture, security settings, and test specifications for the **SmileCraft Dental Clinic** web platform and its integrated **Administrative Dashboard Console**.

---

## 1. Executive Summary & Purpose

### Purpose
SmileCraft is a premium dental clinic web application designed to project a "Refined Medical Luxury" brand identity. It serves as both a high-conversion patient-acquisition channel and a clinical operations management tool. 

### Core Goals
- **Patient Experience:** Allow potential patients to learn about the clinic's MDS specialists, clinical treatments, and advanced technology, view before-and-after results, and book appointments via a seamless 3-step wizard.
- **Clinic Administration:** Streamline administrative operations by providing clinical staff with a unified admin dashboard to review, search, filter, confirm, cancel, and delete appointments and inquiries.
- **Brand Elevation:** Establish trust and aesthetic excellence through curated typography, rich layouts, modern transitions, and interactive user experiences.

---

## 2. Technical Stack & Architecture

The application is built on a modern, performant, and type-safe server-client architecture:

- **Framework:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS v4 + Vanilla CSS custom utilities
- **Database & Backend:** Supabase (Postgres) with Row-Level Security (RLS)
- **State & Logic:** React Server Actions (for data mutation), React Context & Hooks
- **Icons:** Lucide React
- **Animations:** Framer Motion (for elegant transitions, fade-ins, and modal sliders)
- **Email Delivery:** Resend Integration (configured for transaction updates)

---

## 3. Design System & Aesthetics ("Refined Medical Luxury")

The user interface follows premium luxury clinic guidelines:

### Typography
- **Primary Display font:** *Outfit* (elegant, clean geometric headings)
- **Body copy:** *Inter* / *Roboto* (highly readable, high contrast)

### Color Palette (Custom Theme)
- **Primary (Luxurious Gold/Bronze):** HSL-curated gold tones representing quality and premium care.
- **Secondary (Dark Sage/Navy):** Rich background tones representing medical authority and hygiene.
- **Surface & Backgrounds:** Off-whites, soft creams (`#FAF9F6`), and absolute glassmorphic transparencies for modals.
- **State Colors:** Emerald Green (Success), Crimson Red (Cancel/Error), Amber Gold (Pending).

### Visual Enhancements
- **Glassmorphism:** Frosted-glass cards (`backdrop-blur-md bg-white/70 border border-white/20`) for modern overlays.
- **Micro-animations:** Smooth scale-up hover effects, custom active state indicators, and layout transitions via Framer Motion.

---

## 4. Information Architecture & Public Pages

The site consists of the following public-facing routes:

| Route Path | File Location | Key Purpose / Feature |
| :--- | :--- | :--- |
| `/` | `src/app/(public)/page.tsx` | **Homepage:** Hero banner, facility showcase, doctor highlights, clinical statistics, testimonial carousels, and footer newsletter subscription. |
| `/about` | `src/app/(public)/about/page.tsx` | **About Us:** Details clinical philosophy, specialized MDS education standards, and Navrangpura facility details. |
| `/services` | `src/app/(public)/services/page.tsx` | **Services Directory:** Categories (Preventative, Alignment, Restoration, Cosmetic, Emergency) with pricing estimates and service durations. |
| `/doctors` | `src/app/(public)/doctors/page.tsx` | **Specialists Roster:** Grid of dentists filtered by specialty with qualifications and language proficiency. |
| `/faq` | `src/app/(public)/faq/page.tsx` | **FAQ Guide:** Accordion-style layout categorized by topic (Billing, Treatment, Comfort) with a live text search bar. |
| `/gallery` | `src/app/(public)/gallery/page.tsx` | **Visual Showcase:** Category filter tabs (Clinic, Tech, Team) and full-screen image lightbox modal with description overlays. |
| `/before-after` | `src/app/(public)/before-after/page.tsx` | **Clinical Case Studies:** Real before/after tooth correction and implant sliders. Includes a **Direct Book** button that pre-populates the booking wizard with specific treatments. |
| `/book` | `src/app/(public)/book/page.tsx` | **3-Step Appointment Wizard:** Patient-booking interface. |
| `/contact` | `src/app/(public)/contact/page.tsx` | **Contact Inquiry:** Feedback form, phone numbers, Google Map frame, and WhatsApp support. |

---

## 5. Interactive Public Features & User Flows

### A. 3-Step Appointment Booking Wizard (`/book`)
The core conversion funnel of the site is an interactive, multi-step booking wizard:

1. **Step 1: Treatment & Specialist Selection**
   - User selects a treatment category (e.g., General Dentistry, Orthodontics, Dental Implants, Teeth Whitening).
   - User selects a dentist from the available roster based on specialty.
2. **Step 2: Date & Time Selection**
   - User selects an appointment date from an interactive calendar interface.
   - User selects a time slot from available times (09:00 AM – 07:00 PM).
3. **Step 3: Contact Details & Notes**
   - Input fields: *Full Name*, *Email Address*, *Phone Number*, and *Special Notes*.
   - Includes real-time client-side validation (e.g., email format check, empty fields blocker).
4. **Data Submission:**
   - Triggers `bookAppointmentAction` Server Action.
   - Inserts row to Supabase `appointments` table with `status = 'pending'`.
   - Renders a glassmorphic success modal with booking summary.

### B. Contact Form (`/contact`)
- Input fields: *Name*, *Email*, *Phone*, *Message*.
- Action: Triggers `submitContactAction` Server Action, inserting a record into the `contact_messages` table.
- Feedback: Shows inline green success alert card.

### C. Footer Newsletter Signup
- Input field: *Email Address* (located in the global footer).
- Validation: Verifies email format before trigger.
- Action: Triggers `subscribeNewsletterAction` to insert email into `newsletter_subscribers` table.

---

## 6. Database Schema (Supabase PostgreSQL)

The database schema is designed for operational tracking, query optimization, and secure access:

```sql
-- 1. Appointments Table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);

-- 2. Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Contact Messages Table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Row-Level Security (RLS) Configuration
To protect patient privacy, database access policies are strictly enforced:

| Table | Operation | Allowed Actor | Policy Logic |
| :--- | :--- | :--- | :--- |
| `appointments` | `INSERT` | Public (Anonymous) | Permitted for all new bookings |
| `appointments` | `SELECT` / `UPDATE` | Admin (Authenticated) | Admin verification required |
| `newsletter_subscribers` | `INSERT` | Public (Anonymous) | Permitted for email signups |
| `newsletter_subscribers` | `SELECT` | Admin (Authenticated) | Admin verification required |
| `contact_messages` | `INSERT` | Public (Anonymous) | Permitted for contact submissions |
| `contact_messages` | `SELECT` | Admin (Authenticated) | Admin verification required |

---

## 7. Administrative Dashboard Console (`/admin`)

The Administrative Dashboard provides a comprehensive operations cockpit for clinic managers:

### Key Sections
1. **Dashboard Overview:** Displays KPI cards (Total Bookings, Pending Requests, Active Doctors, Contact Inquiries) and recent activity logs.
2. **Appointments Panel:**
   - Filters: Filter list by status (All, Pending, Confirmed, Cancelled) or search text query (matches patient name, phone, or email).
   - Actions: 
     - **Confirm:** Update status to `confirmed` (changes pill to green).
     - **Cancel:** Update status to `cancelled` (changes pill to red).
     - **Delete:** Permanently remove booking from records.
3. **Doctors Management:** Roster view displaying clinical specialists and active availability hours.
4. **Services Panel:** View dental treatment pricing, durations, and active service catalogs.
5. **Blog Posts:** Management interface for clinical articles.
6. **Testimonials Panel:** Moderation panel for patient reviews.
7. **Contact Messages Panel:** Lists all feedback submissions with search filtering and direct deletion actions.
8. **Settings Panel:**
   - **Simulated Mode Toggle:** Switches between live Supabase queries and local client-state mock storage.
   - **Connection Diagnostic Tool:** Verification tool to test database credentials.

---

## 8. Verification & QA Testing Plan

Automated frontend testing is managed using **TestSprite** and **Playwright** to ensure high-fidelity operations:

### High-Priority Test Cases
- **TC001 - Public Booking wizard access:** Verifies that the multi-step booking form loads and allows transitions between steps.
- **TC002 - Complete appointment booking:** Simulates filling out the wizard and verifies a successful row insertion.
- **TC003 - Confirm booking from admin:** Verifies that administrators can view a pending booking and click "Confirm" to update its state.
- **TC004 - Cancel booking from admin:** Verifies that administrators can cancel a booking, changing its visual status to cancelled.
- **TC005 - Validation checks:** Verifies that the wizard blocks empty or incorrectly formatted submissions.
- **TC006 - Case prefill booking:** Verifies that clicking "Book Now" from a clinical case study correctly prefills the selected treatment.
- **TC007 - Delete appointment:** Verifies database records are deleted cleanly from the admin panel.
- **TC008 - Contact form validation:** Confirms fields must match required types before sending contact queries.
- **TC009 - Contact delete admin:** Verifies admins can review and remove contact records.
- **TC010 - Email validation footer:** Confirms newsletter subscriptions block incorrect email formats.
