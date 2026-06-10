"use server";

import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import ical from "ical-generator";
import { services, doctors } from "@/lib/mockData";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

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
    .refine((val) => /^\+?[0-9\s-]{10,15}$/.test(val), "Please enter a valid phone number (e.g. +91 98765 12345)"),
  notes: z.string().optional(),
});

// Helper: Convert time slot (e.g. "09:30 AM" or "03:15 PM") to 24h format "HH:MM:SS"
function convertSlotTo24h(slot: string): string {
  const [time, modifier] = slot.split(" ");
  let [hours, minutes] = time.split(":");
  
  if (hours === "12") {
    hours = "00";
  }
  
  if (modifier === "PM") {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours.padStart(2, "0")}:${minutes}:00`;
}

export async function bookAppointmentAction(formData: {
  serviceId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  notes?: string;
}) {
  try {
    // 1. Zod Validation
    const validation = bookingSchema.safeParse(formData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid appointment details.",
      };
    }

    const data = validation.data;

    // 2. Fetch service & doctor details from mockData to formulate emails and ics details
    const selectedService = services.find((s) => s.id === data.serviceId);
    const selectedDoctor = doctors.find((d) => d.id === data.doctorId);

    if (!selectedService || !selectedDoctor) {
      return {
        success: false,
        error: "Selected service or dentist is invalid.",
      };
    }

    // 3. Prevent Double Booking
    // Check if there is an active (non-cancelled) booking for the same doctor, date, and time slot
    const { data: existingBookings, error: checkError } = await supabase
      .from("appointments")
      .select("id")
      .eq("doctor_id", data.doctorId)
      .eq("appointment_date", data.appointmentDate)
      .eq("appointment_time", data.appointmentTime)
      .neq("status", "cancelled");

    if (checkError) {
      console.error("Supabase double-booking check failed:", checkError);
    } else if (existingBookings && existingBookings.length > 0) {
      return {
        success: false,
        error: "This timing slot is already booked for the selected doctor. Please select another slot.",
      };
    }

    // 4. Save to Supabase (inserting status as 'confirmed')
    const { data: dbData, error: dbError } = await supabase
      .from("appointments")
      .insert([
        {
          service_id: data.serviceId,
          doctor_id: data.doctorId,
          appointment_date: data.appointmentDate,
          appointment_time: data.appointmentTime,
          patient_name: data.patientName,
          patient_email: data.patientEmail,
          patient_phone: data.patientPhone,
          notes: data.notes || null,
          status: "confirmed",
        },
      ])
      .select();

    if (dbError) throw dbError;

    const appointmentId = dbData?.[0]?.id || "unknown";

    // 5. Build Native Calendar Event (.ics) using ical-generator
    let icsContent = "";
    try {
      const time24h = convertSlotTo24h(data.appointmentTime);
      const startTime = new Date(`${data.appointmentDate}T${time24h}`);
      // Standard dental appointment is scheduled for 45 minutes
      const endTime = new Date(startTime.getTime() + 45 * 60000);

      const calendar = ical({ name: "Aura Dental Care Appointment" });
      calendar.createEvent({
        id: appointmentId,
        start: startTime,
        end: endTime,
        summary: `Dental Appointment: ${selectedService.name} - Aura Dental Care`,
        description: `Your dental appointment with ${selectedDoctor.name}.\n\nTreatment: ${selectedService.name}\nDuration: ${selectedService.duration_minutes} minutes\nNotes: ${data.notes || "None"}\n\nThank you for choosing Aura Dental Care.`,
        location: "Aura Dental Care, SG Highway, Ahmedabad, Gujarat, India",
        organizer: {
          name: "Aura Dental Care",
          email: "appointments@brightsmiledental.com",
        },
      });

      icsContent = calendar.toString();
    } catch (icsError) {
      console.error("Failed to generate .ics file:", icsError);
    }

    // 6. Send Email Notifications via Resend
    if (process.env.RESEND_API_KEY) {
      const emailAttachments = icsContent
        ? [
            {
              filename: "appointment.ics",
              content: Buffer.from(icsContent).toString("base64"),
            },
          ]
        : [];

      // Email to Patient
      try {
        await resend.emails.send({
          from: "Aura Dental Care <no-reply@brightsmiledental.com>",
          to: data.patientEmail,
          subject: "Your Appointment Confirmed - Aura Dental Care",
          html: `
            <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; color: #1e293b;">
              <!-- Header -->
              <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 25px;">
                <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e3a8a; margin: 0; font-size: 26px;">Aura Dental Care</h1>
                <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0; font-style: italic;">Gentle Care. Confident Smiles.</p>
              </div>

              <!-- Greeting -->
              <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; font-size: 18px; margin-top: 0; font-weight: bold;">Appointment Confirmed!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                Hello ${data.patientName}, your dental appointment request has been recorded. Below are your session details. We look forward to seeing you at our clinic in Ahmedabad.
              </p>

              <!-- Session Details Card -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 25px 0;">
                <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e3a8a; margin: 0 0 15px 0; font-size: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; font-weight: bold;">Session Details</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; width: 130px; font-weight: 500;">Treatment:</td>
                    <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${selectedService.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Dentist:</td>
                    <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${selectedDoctor.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Date:</td>
                    <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${data.appointmentDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Time Slot:</td>
                    <td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${data.appointmentTime}</td>
                  </tr>
                  ${
                    data.notes
                      ? `
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500; vertical-align: top;">Notes:</td>
                    <td style="padding: 6px 0; color: #475569; font-style: italic;">${data.notes}</td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              <!-- Calendar Notice -->
              <p style="font-size: 13px; line-height: 1.5; color: #64748b; background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 10px 15px; border-radius: 4px;">
                <strong>Add to Calendar:</strong> We have attached an <code>appointment.ics</code> file. Open it to save this event directly to Apple Calendar, Google Calendar, or Outlook.
              </p>

              <!-- Location Banner -->
              <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                <h4 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e3a8a; margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">Aura Dental Care Ahmedabad</h4>
                <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">
                  402, Harmony Business Hub, Near Satellite Cross Road, SG Highway, Ahmedabad, Gujarat 380015
                </p>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #64748b;">
                  Need assistance? Call us: <strong>+91 98765 12345</strong>
                </p>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 12px; color: #94a3b8; margin-top: 30px;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} Aura Dental Care. All rights reserved.</p>
              </div>
            </div>
          `,
          attachments: emailAttachments,
        });
      } catch (patientEmailError) {
        console.error("Resend failed to send appointment confirmation to patient:", patientEmailError);
      }

      // Email to Admin
      const adminEmail = process.env.CLINIC_ADMIN_EMAIL || "info@brightsmiledental.com";
      try {
        await resend.emails.send({
          from: "Aura Dental Care Portal <no-reply@brightsmiledental.com>",
          to: adminEmail,
          subject: `New Appointment Booking: ${data.patientName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #f8fafc;">
              <h2 style="color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px; margin-top: 0;">New Appointment Confirmed</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 130px;">Patient Name:</td>
                  <td style="padding: 6px 0;">${data.patientName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 6px 0;"><a href="mailto:${data.patientEmail}">${data.patientEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Phone:</td>
                  <td style="padding: 6px 0;"><a href="tel:${data.patientPhone}">${data.patientPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Treatment:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #1e3a8a;">${selectedService.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Dentist:</td>
                  <td style="padding: 6px 0;">${selectedDoctor.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Date:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${data.appointmentDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Time Slot:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #1e3a8a;">${data.appointmentTime}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Notes:</td>
                  <td style="padding: 6px 0; font-style: italic;">${data.notes || "None"}</td>
                </tr>
              </table>
              <div style="margin-top: 25px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                This booking was stored in database with ID: <code>${appointmentId}</code>.
              </div>
            </div>
          `,
        });
      } catch (adminEmailError) {
        console.error("Resend failed to send appointment alert to admin:", adminEmailError);
      }
    } else {
      console.warn("Skipping appointment emails dispatch: RESEND_API_KEY is not defined.");
    }

    return {
      success: true,
      appointmentId,
    };
  } catch (error: any) {
    console.error("Appointment booking action error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while booking your appointment.",
    };
  }
}

export async function updateAppointmentStatusAction(id: string, status: "pending" | "confirmed" | "cancelled") {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Failed to update appointment status:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while updating status.",
    };
  }
}

export async function deleteAppointmentAction(id: string) {
  try {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Failed to delete appointment:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while deleting the appointment.",
    };
  }
}

