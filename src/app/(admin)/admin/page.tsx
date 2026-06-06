import React from "react";
import { supabase } from "@/lib/supabase";
import AdminDashboardClient from "./admin-client";

// Turn off caching for admin dashboard so it always gets the latest records from Supabase
export const revalidate = 0;

export const metadata = {
  title: "SmileCraft Admin Portal",
  description: "Administrative console to manage dental appointments, newsletter subscriptions, and patient messages.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.tab || "appointments";

  let dbAppointments: any[] = [];
  let dbSubscribers: any[] = [];
  let dbMessages: any[] = [];
  let errorMsg: string | null = null;

  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project");

  if (isSupabaseConfigured) {
    try {
      // Attempt to fetch from Supabase
      const appointmentsRes = await supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true });

      const subscribersRes = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      const messagesRes = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (appointmentsRes.error) console.warn("Supabase appointments error:", appointmentsRes.error.message);
      if (subscribersRes.error) console.warn("Supabase subscribers error:", subscribersRes.error.message);
      if (messagesRes.error) console.warn("Supabase messages error:", messagesRes.error.message);

      dbAppointments = appointmentsRes.data || [];
      dbSubscribers = subscribersRes.data || [];
      dbMessages = messagesRes.data || [];
    } catch (err: any) {
      console.error("Database fetch exception:", err);
      errorMsg = "Database credentials are not configured or are invalid. Rendering mock data fallbacks.";
    }
  } else {
    errorMsg = "Supabase environment variables are missing or use default placeholders. Database operations bypassed for fast page loading. Rendering demonstration mock data.";
  }

  // Pre-load some mock data as fallback if DB is empty/unconfigured
  const mockAppointments = [
    {
      id: "mock-1",
      service_id: "s1",
      doctor_id: "d1",
      appointment_date: "2026-05-25",
      appointment_time: "10:00 AM",
      patient_name: "Amit Patel",
      patient_email: "amit.patel@example.com",
      patient_phone: "+91 99887 76655",
      notes: "First time consultation. Experiencing minor cold sensitivity.",
      status: "confirmed",
      created_at: new Date().toISOString(),
    },
    {
      id: "mock-2",
      service_id: "s4",
      doctor_id: "d1",
      appointment_date: "2026-05-25",
      appointment_time: "02:00 PM",
      patient_name: "Karan Shah",
      patient_email: "karan.shah@example.com",
      patient_phone: "+91 98250 12345",
      notes: "Laser teeth whitening procedure.",
      status: "confirmed",
      created_at: new Date().toISOString(),
    },
    {
      id: "mock-3",
      service_id: "s5",
      doctor_id: "d3",
      appointment_date: "2026-05-26",
      appointment_time: "11:00 AM",
      patient_name: "Sunita Sharma",
      patient_email: "sunita.s@example.com",
      patient_phone: "+91 98980 98980",
      notes: "Root canal therapy session.",
      status: "confirmed",
      created_at: new Date().toISOString(),
    },
  ];

  const mockSubscribers = [
    { id: "mock-sub-1", email: "praveen.mehta@example.com", created_at: "2026-05-20T10:00:00Z" },
    { id: "mock-sub-2", email: "nisha.desai@example.com", created_at: "2026-05-21T14:30:00Z" },
    { id: "mock-sub-3", email: "rajesh.patel@example.com", created_at: "2026-05-22T08:15:00Z" },
  ];

  const mockMessages = [
    {
      id: "mock-msg-1",
      name: "Dharmesh Vyas",
      email: "dharmesh.vyas@example.com",
      phone: "+91 94260 54321",
      message: "Do you offer dental alignment solutions for senior citizens, and does your clinic support insurance pre-auth support?",
      created_at: "2026-05-22T10:00:00Z",
    },
    {
      id: "mock-msg-2",
      name: "Parul Mehta",
      email: "parul.m@example.com",
      phone: "+91 98799 87654",
      message: "I need to schedule a pediatric scaling checkup for my 6 year old daughter with Dr. Neha Desai on Saturday morning.",
      created_at: "2026-05-22T11:45:00Z",
    },
  ];

  // Resolve final lists to display
  const appointments = dbAppointments.length > 0 ? dbAppointments : mockAppointments;
  const subscribers = dbSubscribers.length > 0 ? dbSubscribers : mockSubscribers;
  const messages = dbMessages.length > 0 ? dbMessages : mockMessages;

  const isUsingFallback = dbAppointments.length === 0 && dbSubscribers.length === 0 && dbMessages.length === 0;

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-text-primary">
          Clinic Administration Console
        </h1>
        <p className="font-body text-sm text-text-secondary mt-xs">
          Overview of clinical slots, newsletter campaigns, and customer feedback.
        </p>
      </div>

      {/* Warning if fallback is active */}
      {isUsingFallback && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-md text-xs text-amber-800 font-body flex items-start gap-xs">
          <span className="font-bold shrink-0">Development Notice:</span>
          <span>
            {errorMsg || "Supabase database returned 0 records. Displaying pre-loaded mock demonstration records."}
          </span>
        </div>
      )}

      {/* Renders Tab management inside client component */}
      <AdminDashboardClient
        appointments={appointments}
        subscribers={subscribers}
        messages={messages}
        tab={activeTab}
      />
    </div>
  );
}
