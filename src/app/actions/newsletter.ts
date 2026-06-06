"use server";

import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

const newsletterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export async function subscribeNewsletterAction(formData: { email: string }) {
  try {
    // 1. Validate form input serverside
    const validation = newsletterSchema.safeParse(formData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Invalid validation parameters.",
      };
    }

    const { email } = validation.data;

    // 2. Insert into Supabase database
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (dbError) {
      // Handle Postgres unique constraint violation
      if (dbError.code === "23505") {
        return {
          success: false,
          error: "This email is already subscribed to our newsletter.",
        };
      }
      throw dbError;
    }

    // 3. Send email confirmation using Resend (optional check for API key)
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "SmileCraft <no-reply@smilecraftclinic.com>",
          to: email,
          subject: "Welcome to the SmileCraft Family!",
          html: `
            <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
              <!-- Header -->
              <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px;">
                <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e3a8a; margin: 0; font-size: 24px;">SmileCraft Dental Clinic</h1>
                <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0; font-style: italic;">Gentle Care. Confident Smiles.</p>
              </div>
              
              <!-- Content -->
              <h2 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; font-size: 18px; margin-top: 0;">Hello there!</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                Thank you for subscribing to the SmileCraft newsletter. We are thrilled to welcome you to our family.
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #475569;">
                From now on, you'll be the first to receive updates on advanced oral care tips, clinic updates from Ahmedabad, and exclusive dental health packages.
              </p>
              
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 15px; margin: 25px 0; text-align: center;">
                <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e3a8a; margin: 0 0 10px 0; font-size: 16px;">Need to book a visit?</h3>
                <p style="font-size: 13px; color: #64748b; margin: 0 0 15px 0;">Schedule a session with our specialist dentist in seconds.</p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://smilecraftclinic.com"}/appointments" style="background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Book an Appointment</a>
              </div>
              
              <!-- Footer -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 12px; color: #94a3b8; margin-top: 30px;">
                <p style="margin: 0 0 5px 0;">SmileCraft Clinic, Ahmedabad, Gujarat, India</p>
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} SmileCraft Clinic. All rights reserved.</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Resend failed to send newsletter email:", emailError);
      }
    } else {
      console.warn("Skipping newsletter email sending: RESEND_API_KEY is not defined.");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during subscription.",
    };
  }
}

export async function deleteSubscriberAction(id: string) {
  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Failed to delete subscriber:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while deleting the subscriber.",
    };
  }
}

