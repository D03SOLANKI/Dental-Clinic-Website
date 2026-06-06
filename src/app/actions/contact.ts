"use server";

import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => /^\+?[0-9\s-]{10,15}$/.test(val), "Please enter a valid phone number"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function submitContactAction(formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  try {
    // 1. Validate inputs
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid validation parameters.",
      };
    }

    const { name, email, phone, message } = validation.data;

    // 2. Insert into Supabase
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([{ name, email, phone, message }]);

    if (dbError) throw dbError;

    // 3. Send email notifications via Resend
    if (process.env.RESEND_API_KEY) {
      // Send receipt email to Patient
      try {
        await resend.emails.send({
          from: "SmileCraft <no-reply@smilecraftclinic.com>",
          to: email,
          subject: "We've received your message - SmileCraft",
          html: `
            <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <!-- Header -->
              <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px;">
                <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e3a8a; margin: 0; font-size: 24px;">SmileCraft Dental Clinic</h1>
                <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0; font-style: italic;">Gentle Care. Confident Smiles.</p>
              </div>
              
              <!-- Content -->
              <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; font-size: 18px; margin-top: 0;">Dear ${name},</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                Thank you for contacting SmileCraft Dental Clinic. We have received your inquiry and our desk team will get back to you shortly.
              </p>
              
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e3a8a; margin: 0 0 8px 0; font-size: 14px;">Summary of your message:</h3>
                <p style="font-size: 14px; font-style: italic; color: #475569; margin: 0;">"${message}"</p>
              </div>

              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                If your inquiry is urgent, please call our emergency helpline at <strong style="color: #1e3a8a;">+91 79 4000 5000</strong>.
              </p>
              
              <!-- Footer -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 12px; color: #94a3b8; margin-top: 30px;">
                <p style="margin: 0 0 5px 0;">SmileCraft Clinic, Ahmedabad, Gujarat, India</p>
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} SmileCraft Clinic. All rights reserved.</p>
              </div>
            </div>
          `,
        });
      } catch (patientEmailError) {
        console.error("Resend failed to send contact confirmation to patient:", patientEmailError);
      }

      // Send alert email to Admin
      const adminEmail = process.env.CLINIC_ADMIN_EMAIL || "info@smilecraftclinic.com";
      try {
        await resend.emails.send({
          from: "SmileCraft Portal <no-reply@smilecraftclinic.com>",
          to: adminEmail,
          subject: `New Contact Inquiry from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
              <h2 style="color: #1e3a8a; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 6px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Phone:</td>
                  <td style="padding: 6px 0;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Message:</td>
                  <td style="padding: 6px 0; white-space: pre-wrap; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-top: 5px;">${message}</td>
                </tr>
              </table>
              <div style="margin-top: 25px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                This inquiry was submitted on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} via SmileCraft Portal.
              </div>
            </div>
          `,
        });
      } catch (adminEmailError) {
        console.error("Resend failed to send contact alert to admin:", adminEmailError);
      }
    } else {
      console.warn("Skipping contact emails dispatch: RESEND_API_KEY is not defined.");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while sending your message.",
    };
  }
}

export async function deleteContactMessageAction(id: string) {
  try {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Failed to delete contact message:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while deleting the message.",
    };
  }
}

