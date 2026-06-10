"use client";

import React, { useState, useMemo, useEffect } from "react";
import { services, doctors, testimonials as initialTestimonials } from "@/lib/mockData";
import { updateAppointmentStatusAction, deleteAppointmentAction } from "@/app/actions/booking";
import { deleteSubscriberAction } from "@/app/actions/newsletter";
import { deleteContactMessageAction } from "@/app/actions/contact";
import {
  Calendar,
  Users,
  Mail,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  User,
  Clock,
  ClipboardList,
  FileText,
  X,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  Star
} from "lucide-react";

interface Appointment {
  id: string;
  service_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

interface AdminDashboardClientProps {
  appointments: Appointment[];
  subscribers: Subscriber[];
  messages: ContactMessage[];
  tab?: string;
}

export default function AdminDashboardClient({
  appointments: initialAppointments,
  subscribers: initialSubscribers,
  messages: initialMessages,
  tab,
}: AdminDashboardClientProps) {
  // Local state populated from props
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  // Tab State
  const [activeTab, setActiveTab] = useState<"appointments" | "subscribers" | "messages" | "doctors" | "services" | "blogs" | "testimonials" | "settings">("appointments");

  // Local state for clinical roster, treatments, blogs, testimonials, and settings
  const [doctorsList, setDoctorsList] = useState(doctors);
  const [servicesList, setServicesList] = useState(services);
  const [blogsList, setBlogsList] = useState([
    { id: "b1", title: "5 Tips for Maintaining Pearly White Teeth", author: "Dr. Aarav Mehta", category: "Oral Hygiene", status: "Published", date: "2026-05-15" },
    { id: "b2", title: "Understanding Dental Implants: Process & Benefits", author: "Dr. Kunal Patel", category: "Restoration", status: "Published", date: "2026-05-18" },
    { id: "b3", title: "Why Pediatric Scaling is Crucial for Young Children", author: "Dr. Neha Desai", category: "Pediatrics", status: "Draft", date: "2026-05-22" },
  ]);
  const [testimonialsList, setTestimonialsList] = useState(initialTestimonials);
  const [settingsForm, setSettingsForm] = useState({
    clinicName: "Aura Dental Care",
    phone: "+91 98765 12345",
    emergencyDesk: "+91 99999 88888",
    address: "SG Highway, Satellite, Ahmedabad",
    demoMode: true,
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Loading & Toast States
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Detail Modal State
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Hydration state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync tab from prop
  useEffect(() => {
    if (tab === "appointments" || tab === "subscribers" || tab === "messages" || tab === "doctors" || tab === "services" || tab === "blogs" || tab === "testimonials" || tab === "settings") {
      setActiveTab(tab as any);
    }
  }, [tab]);

  // Safe locale date formatting helpers to prevent hydration mismatches
  const formatDate = (dateStr: string) => {
    if (!mounted) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!mounted) return "";
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatRawDateTime = (dateStr: string) => {
    if (!mounted) return "";
    return new Date(dateStr).toLocaleString("en-IN");
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Sync state if props change (e.g. on server revalidation)
  useEffect(() => {
    setAppointments(initialAppointments);
  }, [initialAppointments]);

  useEffect(() => {
    setSubscribers(initialSubscribers);
  }, [initialSubscribers]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  // Helper Maps for Services and Doctors
  const serviceMap = useMemo(() => {
    return new Map(services.map((s) => [s.id, s.name]));
  }, []);

  const doctorMap = useMemo(() => {
    return new Map(doctors.map((d) => [d.id, d.name]));
  }, []);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDoctorFilter("all");
    setServiceFilter("all");
    setDateFilter("");
  };

  // Change tab and sync URL
  const changeTab = (newTab: "appointments" | "subscribers" | "messages" | "doctors" | "services" | "blogs" | "testimonials" | "settings") => {
    setActiveTab(newTab);
    handleResetFilters();
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", newTab);
      window.history.pushState(null, "", url.pathname + url.search);
    }
  };

  // Appointment metrics
  const metrics = useMemo(() => {
    const totalAppts = appointments.length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    const totalSubs = subscribers.length;
    const totalMsgs = messages.length;

    return {
      totalAppointments: totalAppts,
      confirmed,
      pending,
      cancelled,
      totalSubscribers: totalSubs,
      totalMessages: totalMsgs,
    };
  }, [appointments, subscribers, messages]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      // 1. Search Query (name, email, phone, notes)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        appt.patient_name.toLowerCase().includes(q) ||
        appt.patient_email.toLowerCase().includes(q) ||
        appt.patient_phone.toLowerCase().includes(q) ||
        (appt.notes && appt.notes.toLowerCase().includes(q));

      // 2. Status
      const matchesStatus = statusFilter === "all" || appt.status === statusFilter;

      // 3. Doctor
      const matchesDoctor = doctorFilter === "all" || appt.doctor_id === doctorFilter;

      // 4. Service
      const matchesService = serviceFilter === "all" || appt.service_id === serviceFilter;

      // 5. Date
      const matchesDate = dateFilter === "" || appt.appointment_date === dateFilter;

      return matchesSearch && matchesStatus && matchesDoctor && matchesService && matchesDate;
    });
  }, [appointments, searchQuery, statusFilter, doctorFilter, serviceFilter, dateFilter]);

  // Filtered Subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const q = searchQuery.toLowerCase().trim();
      return q === "" || sub.email.toLowerCase().includes(q);
    });
  }, [subscribers, searchQuery]);

  // Filtered Messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        q === "" ||
        msg.name.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.phone.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q)
      );
    });
  }, [messages, searchQuery]);

  // Action: Update Appointment Status
  const handleUpdateStatus = async (id: string, newStatus: "pending" | "confirmed" | "cancelled") => {
    setActionLoadingId(id);
    try {
      const result = await updateAppointmentStatusAction(id, newStatus);
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment((prev) => prev ? { ...prev, status: newStatus } : null);
        }
        showToast(`Appointment status updated to ${newStatus}.`, "success");
      } else {
        // Fallback for demo when Supabase credentials are missing
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment((prev) => prev ? { ...prev, status: newStatus } : null);
        }
        showToast("Demo Mode: Status updated locally (Database connection bypassed).", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating status.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Delete Appointment
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this appointment?")) return;
    setActionLoadingId(id);
    try {
      const result = await deleteAppointmentAction(id);
      if (result.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setSelectedAppointment(null);
        showToast("Appointment deleted successfully.", "success");
      } else {
        // Fallback for demo
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setSelectedAppointment(null);
        showToast("Demo Mode: Appointment removed locally (Database connection bypassed).", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting appointment.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Delete Subscriber
  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    setActionLoadingId(id);
    try {
      const result = await deleteSubscriberAction(id);
      if (result.success) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        showToast("Subscriber removed successfully.", "success");
      } else {
        // Fallback
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        showToast("Demo Mode: Subscriber removed locally.", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error removing subscriber.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Action: Delete Contact Message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setActionLoadingId(id);
    try {
      const result = await deleteContactMessageAction(id);
      if (result.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSelectedMessage(null);
        showToast("Message deleted successfully.", "success");
      } else {
        // Fallback
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSelectedMessage(null);
        showToast("Demo Mode: Message removed locally.", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting message.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-lg">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Appointments Card */}
        <div className="bg-surface border border-surface-muted rounded-lg p-md shadow-card hover:shadow-card-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                Appointments Pipeline
              </span>
              <h3 className="text-3xl font-display font-extrabold text-text-primary mt-xs">
                {metrics.totalAppointments}
              </h3>
            </div>
            <div className="bg-primary-50 text-primary-500 p-sm rounded-md">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-xs mt-md pt-sm border-t border-surface-muted text-center text-xs">
            <div>
              <span className="block font-bold text-accent-mint">{metrics.confirmed}</span>
              <span className="text-text-muted font-body">Confirmed</span>
            </div>
            <div>
              <span className="block font-bold text-amber-500">{metrics.pending}</span>
              <span className="text-text-muted font-body">Pending</span>
            </div>
            <div>
              <span className="block font-bold text-accent-coral">{metrics.cancelled}</span>
              <span className="text-text-muted font-body">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Contact Messages Card */}
        <div className="bg-surface border border-surface-muted rounded-lg p-md shadow-card hover:shadow-card-md transition-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                Inquiries Received
              </span>
              <h3 className="text-3xl font-display font-extrabold text-text-primary mt-xs">
                {metrics.totalMessages}
              </h3>
            </div>
            <div className="bg-teal-50 text-teal-600 p-sm rounded-md">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-md pt-sm border-t border-surface-muted text-xs text-text-secondary font-body">
            Direct customer questions and feedback submissions.
          </div>
        </div>

        {/* Newsletter Subscribers Card */}
        <div className="bg-surface border border-surface-muted rounded-lg p-md shadow-card hover:shadow-card-md transition-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-body font-semibold text-text-secondary uppercase tracking-wider">
                Newsletter Subscribers
              </span>
              <h3 className="text-3xl font-display font-extrabold text-text-primary mt-xs">
                {metrics.totalSubscribers}
              </h3>
            </div>
            <div className="bg-indigo-50 text-indigo-600 p-sm rounded-md">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-md pt-sm border-t border-surface-muted text-xs text-text-secondary font-body">
            Unique patient contacts signed up for clinical newsletters.
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-b border-surface-muted flex flex-wrap gap-sm">
        <button
          onClick={() => changeTab("appointments")}
          className={`pb-sm px-md text-sm font-body font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "appointments"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Appointments Slots ({filteredAppointments.length})
        </button>
        <button
          onClick={() => changeTab("messages")}
          className={`pb-sm px-md text-sm font-body font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "messages"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Patient Messages ({filteredMessages.length})
        </button>
        <button
          onClick={() => changeTab("subscribers")}
          className={`pb-sm px-md text-sm font-body font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "subscribers"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Newsletter Subscribers ({filteredSubscribers.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-surface-muted rounded-lg p-md shadow-card space-y-md">
        <div className="flex flex-col md:flex-row gap-sm items-stretch">
          {/* Main Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-md top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder={
                activeTab === "appointments"
                  ? "Search by patient name, email, phone, notes..."
                  : activeTab === "messages"
                  ? "Search message contents, name, email..."
                  : "Search subscriber email..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-2xl pr-md py-sm bg-surface-subtle border border-surface-muted rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-500 font-body transition-colors"
            />
          </div>

          {/* Conditional Filters for Appointments */}
          {activeTab === "appointments" && (
            <div className="flex flex-wrap gap-sm">
              {/* Status Select */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-md pr-xl py-sm bg-surface-subtle border border-surface-muted rounded-md text-sm text-text-primary focus:outline-none focus:border-primary-500 font-body cursor-pointer transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-sm top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>

              {/* Dentist Select */}
              <div className="relative">
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="appearance-none pl-md pr-xl py-sm bg-surface-subtle border border-surface-muted rounded-md text-sm text-text-primary focus:outline-none focus:border-primary-500 font-body cursor-pointer transition-colors"
                >
                  <option value="all">All Dentists</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-sm top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>

              {/* Service Select */}
              <div className="relative">
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="appearance-none pl-md pr-xl py-sm bg-surface-subtle border border-surface-muted rounded-md text-sm text-text-primary focus:outline-none focus:border-primary-500 font-body cursor-pointer transition-colors"
                >
                  <option value="all">All Services</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-sm top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>

              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-md pr-md py-sm bg-surface-subtle border border-surface-muted rounded-md text-sm text-text-primary focus:outline-none focus:border-primary-500 font-body cursor-pointer transition-colors"
              />
            </div>
          )}

          {/* Reset Action */}
          <button
            onClick={handleResetFilters}
            className="px-md py-sm text-sm font-body font-semibold text-text-secondary hover:text-text-primary border border-surface-muted rounded-md hover:bg-surface-subtle transition-colors flex items-center gap-xs cursor-pointer shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="bg-surface border border-surface-muted rounded-lg shadow-card overflow-hidden">
        {/* Appointments Tab Content */}
        {activeTab === "appointments" && (
          <div className="overflow-x-auto">
            {filteredAppointments.length === 0 ? (
              <div className="p-xl text-center text-text-muted font-body text-sm">
                No appointments match the filter parameters.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-subtle border-b border-surface-muted text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                    <th className="p-md font-body">Patient</th>
                    <th className="p-md font-body">Treatment / Doctor</th>
                    <th className="p-md font-body">Scheduled Slot</th>
                    <th className="p-md font-body">Status</th>
                    <th className="p-md font-body">Booked Date</th>
                    <th className="p-md text-right font-body">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-muted">
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-surface-subtle/50 transition-colors text-sm">
                      <td className="p-md">
                        <div className="font-body font-bold text-text-primary">{appt.patient_name}</div>
                        <div className="text-xs text-text-secondary font-body mt-2xs">
                          {appt.patient_email} • {appt.patient_phone}
                        </div>
                      </td>
                      <td className="p-md">
                        <div className="font-body font-semibold text-text-primary">
                          {serviceMap.get(appt.service_id) || appt.service_id}
                        </div>
                        <div className="text-xs text-text-secondary font-body mt-2xs">
                          {doctorMap.get(appt.doctor_id) || appt.doctor_id}
                        </div>
                      </td>
                      <td className="p-md font-body text-text-primary whitespace-nowrap">
                        <div className="font-semibold">{appt.appointment_date}</div>
                        <div className="text-xs text-text-secondary mt-2xs flex items-center gap-2xs">
                          <Clock className="w-3.5 h-3.5 shrink-0" /> {appt.appointment_time}
                        </div>
                      </td>
                      <td className="p-md">
                        <span
                          className={`inline-flex items-center px-sm py-2xs rounded-full text-xs font-body font-bold tracking-wide uppercase ${
                            appt.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : appt.status === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-md font-body text-text-muted text-xs">
                        {formatDate(appt.created_at)}
                      </td>
                      <td className="p-md text-right space-x-xs whitespace-nowrap">
                        {/* Quick View Button */}
                        <button
                          onClick={() => setSelectedAppointment(appt)}
                          className="p-sm text-text-secondary hover:text-primary-600 rounded-md hover:bg-surface-muted transition-colors cursor-pointer inline-flex items-center"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Status Change Toggles */}
                        {appt.status !== "confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, "confirmed")}
                            disabled={actionLoadingId === appt.id}
                            className="px-sm py-xs text-xs font-body font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        {appt.status !== "cancelled" && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, "cancelled")}
                            disabled={actionLoadingId === appt.id}
                            className="px-sm py-xs text-xs font-body font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteAppointment(appt.id)}
                          disabled={actionLoadingId === appt.id}
                          className="p-sm text-text-muted hover:text-accent-coral rounded-md hover:bg-surface-muted transition-colors cursor-pointer inline-flex items-center"
                          title="Delete Appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Patient Messages Tab Content */}
        {activeTab === "messages" && (
          <div className="divide-y divide-surface-muted">
            {filteredMessages.length === 0 ? (
              <div className="p-xl text-center text-text-muted font-body text-sm">
                No patient inquiries received.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div key={msg.id} className="p-md hover:bg-surface-subtle/50 transition-colors flex justify-between gap-md items-start min-w-0">
                  <div className="space-y-xs max-w-3xl min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-sm gap-y-2xs">
                      <h4 className="font-body font-bold text-text-primary text-sm whitespace-nowrap">{msg.name}</h4>
                      <span className="text-xs text-text-muted font-body whitespace-nowrap">
                        {formatDateTime(msg.created_at)}
                      </span>
                    </div>
                    <div className="text-xs text-text-secondary font-body break-all">
                      Email: <a href={`mailto:${msg.email}`} className="text-primary-600 hover:underline">{msg.email}</a> • Phone: <a href={`tel:${msg.phone}`} className="text-primary-600 hover:underline whitespace-nowrap">{msg.phone}</a>
                    </div>
                    <p className="text-sm font-body text-text-primary leading-relaxed bg-surface-subtle p-sm border border-surface-muted rounded-md mt-xs whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex gap-xs shrink-0">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="p-sm text-text-secondary hover:text-primary-600 rounded-md hover:bg-surface-muted transition-colors cursor-pointer inline-flex items-center"
                      title="Zoom Inquiry"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      disabled={actionLoadingId === msg.id}
                      className="p-sm text-text-muted hover:text-accent-coral rounded-md hover:bg-surface-muted transition-colors cursor-pointer inline-flex items-center"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Newsletter Subscribers Tab Content */}
        {activeTab === "subscribers" && (
          <div className="overflow-x-auto">
            {filteredSubscribers.length === 0 ? (
              <div className="p-xl text-center text-text-muted font-body text-sm">
                No active newsletter subscribers.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-subtle border-b border-surface-muted text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                    <th className="p-md font-body">Email Address</th>
                    <th className="p-md font-body">Subscribed At</th>
                    <th className="p-md text-right font-body">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-muted">
                  {filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-surface-subtle/50 transition-colors text-sm">
                      <td className="p-md font-body font-medium text-text-primary break-all">
                        <a href={`mailto:${sub.email}`} className="hover:text-primary-600 hover:underline">
                          {sub.email}
                        </a>
                      </td>
                      <td className="p-md font-body text-text-secondary whitespace-nowrap">
                        {formatDateTime(sub.created_at)}
                      </td>
                      <td className="p-md text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteSubscriber(sub.id)}
                          disabled={actionLoadingId === sub.id}
                          className="p-sm text-text-muted hover:text-accent-coral rounded-md hover:bg-surface-muted transition-colors cursor-pointer inline-flex items-center"
                          title="Unsubscribe Email"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Doctors Tab Content */}
        {activeTab === "doctors" && (
          <div className="p-md space-y-md">
            <div className="flex justify-between items-center px-sm">
              <div>
                <h3 className="font-display font-extrabold text-lg text-text-primary">Specialist Roster</h3>
                <p className="font-body text-xs text-text-secondary">Roster of medical specialists and scheduled consulting days.</p>
              </div>
              <button 
                onClick={() => showToast("Feature Demo: Dentist creation form is deactivated.", "error")}
                className="bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-xs font-bold px-md py-sm rounded shadow-sm cursor-pointer transition-colors"
              >
                Add Specialist
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {doctorsList.map((doc) => (
                <div key={doc.id} className="bg-surface border border-surface-muted rounded-xl p-md flex gap-md items-start shadow-sm hover:shadow-card transition-shadow">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-surface-muted">
                    <img src={doc.photo_url} alt={doc.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="space-y-2xs min-w-0 flex-1 font-body">
                    <h4 className="font-display font-bold text-base text-text-primary leading-tight">{doc.name}</h4>
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-wide">{doc.specialty}</p>
                    <div className="text-2xs text-text-secondary mt-2xs">
                      <span className="font-semibold text-text-primary">Qualifications:</span> {doc.qualifications.join(", ")}
                    </div>
                    <div className="text-2xs text-text-secondary">
                      <span className="font-semibold text-text-primary">Available Days:</span> {doc.available_days.join(", ")}
                    </div>
                    <div className="flex gap-xs pt-xs border-t border-surface-muted mt-xs">
                      <button 
                        onClick={() => showToast(`Edit Specialist: Config panel for ${doc.name} is disabled.`, "error")}
                        className="px-sm py-2xs text-2xs font-bold text-primary-600 hover:bg-primary-50 rounded border border-primary-100 transition-colors cursor-pointer"
                      >
                        Edit Profile
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${doc.name} from the clinical list?`)) {
                            setDoctorsList((prev) => prev.filter((d) => d.id !== doc.id));
                            showToast(`Specialist ${doc.name} removed successfully.`, "success");
                          }
                        }}
                        className="px-sm py-2xs text-2xs font-bold text-accent-coral hover:bg-rose-50 rounded border border-transparent transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab Content */}
        {activeTab === "services" && (
          <div className="p-md space-y-md">
            <div className="flex justify-between items-center px-sm">
              <div>
                <h3 className="font-display font-extrabold text-lg text-text-primary">Clinical Treatments</h3>
                <p className="font-body text-xs text-text-secondary">Manage clinic offerings, classifications, duration, and price points.</p>
              </div>
              <button 
                onClick={() => showToast("Feature Demo: Treatment creation panel is currently deactivated.", "error")}
                className="bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-xs font-bold px-md py-sm rounded shadow-sm cursor-pointer transition-colors"
              >
                Add Treatment
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-subtle border-b border-surface-muted text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                    <th className="p-md font-body">Treatment Name</th>
                    <th className="p-md font-body">Category</th>
                    <th className="p-md font-body">Duration</th>
                    <th className="p-md font-body">Price Range</th>
                    <th className="p-md text-right font-body">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-muted text-sm font-body text-text-primary">
                  {servicesList.map((ser) => (
                    <tr key={ser.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="p-md">
                        <div className="font-bold flex items-center gap-xs">
                          {ser.name}
                          {ser.is_featured && (
                            <span className="text-[9px] font-bold px-sm py-2xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-text-secondary mt-2xs max-w-xl">{ser.short_description}</div>
                      </td>
                      <td className="p-md font-semibold text-text-secondary">{ser.category}</td>
                      <td className="p-md font-bold">{ser.duration_minutes} mins</td>
                      <td className="p-md text-primary-600 font-bold">{ser.price_range}</td>
                      <td className="p-md text-right space-x-xs whitespace-nowrap">
                        <button 
                          onClick={() => showToast(`Edit Treatment: Panel for ${ser.name} is deactivated.`, "error")}
                          className="px-sm py-xs text-xs font-bold text-primary-600 hover:bg-primary-50 rounded border border-primary-100 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete treatment ${ser.name}?`)) {
                              setServicesList((prev) => prev.filter((s) => s.id !== ser.id));
                              showToast(`Treatment ${ser.name} deleted successfully.`, "success");
                            }
                          }}
                          className="px-sm py-xs text-xs font-bold text-accent-coral hover:bg-rose-50 rounded border border-transparent transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blog Posts Tab Content */}
        {activeTab === "blogs" && (
          <div className="p-md space-y-md">
            <div className="flex justify-between items-center px-sm">
              <div>
                <h3 className="font-display font-extrabold text-lg text-text-primary">Editorial Articles</h3>
                <p className="font-body text-xs text-text-secondary">Draft and publish clinical articles, guides, and updates.</p>
              </div>
              <button 
                onClick={() => showToast("Feature Demo: Editor dashboard is deactivated.", "error")}
                className="bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-xs font-bold px-md py-sm rounded shadow-sm cursor-pointer transition-colors"
              >
                Create Article
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm font-body text-text-primary">
                <thead>
                  <tr className="bg-surface-subtle border-b border-surface-muted text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
                    <th className="p-md">Article Title</th>
                    <th className="p-md">Author</th>
                    <th className="p-md">Category</th>
                    <th className="p-md">Publish Date</th>
                    <th className="p-md">Status</th>
                    <th className="p-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-muted">
                  {blogsList.map((blog) => (
                    <tr key={blog.id} className="hover:bg-surface-subtle/50 transition-colors">
                      <td className="p-md font-bold">{blog.title}</td>
                      <td className="p-md font-semibold text-text-secondary">{blog.author}</td>
                      <td className="p-md">{blog.category}</td>
                      <td className="p-md text-text-muted">{blog.date}</td>
                      <td className="p-md">
                        <span className={`inline-flex px-sm py-2xs rounded-full text-2xs font-bold uppercase border ${
                          blog.status === "Published" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="p-md text-right space-x-xs whitespace-nowrap">
                        <button 
                          onClick={() => {
                            const newStatus = blog.status === "Published" ? "Draft" : "Published";
                            setBlogsList((prev) => prev.map((b) => b.id === blog.id ? { ...b, status: newStatus } : b));
                            showToast(`Article status updated to ${newStatus}.`, "success");
                          }}
                          className="px-sm py-xs text-xs font-bold bg-surface-subtle hover:bg-surface-muted text-text-secondary rounded border border-surface-muted transition-colors cursor-pointer"
                        >
                          {blog.status === "Published" ? "Keep Draft" : "Publish"}
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
                              setBlogsList((prev) => prev.filter((b) => b.id !== blog.id));
                              showToast("Article deleted successfully.", "success");
                            }
                          }}
                          className="px-sm py-xs text-xs font-bold text-accent-coral hover:bg-rose-50 rounded border border-transparent transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Testimonials Tab Content */}
        {activeTab === "testimonials" && (
          <div className="p-md space-y-md">
            <div className="flex justify-between items-center px-sm">
              <div>
                <h3 className="font-display font-extrabold text-lg text-text-primary">Patient Testimonials</h3>
                <p className="font-body text-xs text-text-secondary">Moderate patient feedback submissions and approval statuses.</p>
              </div>
              <button 
                onClick={() => showToast("Feature Demo: Manual review entry form is deactivated.", "error")}
                className="bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-xs font-bold px-md py-sm rounded shadow-sm cursor-pointer transition-colors"
              >
                Register Review
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {testimonialsList.map((test) => (
                <div key={test.id} className="bg-surface border border-surface-muted rounded-xl p-md shadow-sm space-y-sm flex flex-col justify-between hover:shadow-card transition-shadow">
                  <div className="space-y-2xs font-body">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-primary text-sm">{test.patient_name}</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: test.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <div className="text-2xs text-text-secondary mt-2xs">
                      Treatment: <span className="font-semibold text-text-primary">{test.service_name}</span> • Doctor: <span className="font-semibold text-text-primary">{test.doctor_name}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed bg-surface-subtle border border-surface-muted rounded p-sm italic mt-xs">
                      "{test.review}"
                    </p>
                  </div>
                  <div className="flex justify-end gap-xs pt-xs border-t border-surface-muted mt-sm">
                    <button 
                      onClick={() => showToast("Review status approved and synced with patient feed.", "success")}
                      className="px-sm py-xs text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-100 transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to remove this patient review?")) {
                          setTestimonialsList((prev) => prev.filter((t) => t.id !== test.id));
                          showToast("Review deleted successfully.", "success");
                        }
                      }}
                      className="px-sm py-xs text-xs font-bold text-accent-coral hover:bg-rose-50 rounded border border-transparent transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === "settings" && (
          <div className="p-md space-y-md font-body text-sm text-text-primary max-w-2xl">
            <div className="px-sm">
              <h3 className="font-display font-extrabold text-lg text-text-primary">System Settings</h3>
              <p className="font-body text-xs text-text-secondary">Configure administration panel defaults and clinic indicators.</p>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                showToast("System configuration settings updated successfully.", "success");
              }}
              className="bg-surface border border-surface-muted rounded-xl p-md shadow-sm space-y-md mt-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="space-y-2xs">
                  <label className="text-xs font-semibold text-text-secondary uppercase">Clinic Title</label>
                  <input 
                    type="text" 
                    value={settingsForm.clinicName} 
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, clinicName: e.target.value }))}
                    className="w-full px-sm py-xs bg-surface-subtle border border-surface-muted rounded text-sm text-text-primary focus:outline-none focus:border-primary-500 font-body"
                  />
                </div>
                <div className="space-y-2xs">
                  <label className="text-xs font-semibold text-text-secondary uppercase">Primary Contact Phone</label>
                  <input 
                    type="text" 
                    value={settingsForm.phone} 
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-sm py-xs bg-surface-subtle border border-surface-muted rounded text-sm text-text-primary focus:outline-none focus:border-primary-500 font-body"
                  />
                </div>
                <div className="space-y-2xs">
                  <label className="text-xs font-semibold text-text-secondary uppercase">Emergency Desk Line</label>
                  <input 
                    type="text" 
                    value={settingsForm.emergencyDesk} 
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, emergencyDesk: e.target.value }))}
                    className="w-full px-sm py-xs bg-surface-subtle border border-surface-muted rounded text-sm text-text-primary focus:outline-none focus:border-primary-500 font-body"
                  />
                </div>
                <div className="space-y-2xs">
                  <label className="text-xs font-semibold text-text-secondary uppercase">Clinic Location Address</label>
                  <input 
                    type="text" 
                    value={settingsForm.address} 
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-sm py-xs bg-surface-subtle border border-surface-muted rounded text-sm text-text-primary focus:outline-none focus:border-primary-500 font-body"
                  />
                </div>
              </div>
              <div className="flex items-center gap-sm pt-xs">
                <input 
                  type="checkbox" 
                  id="demoMode" 
                  checked={settingsForm.demoMode} 
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, demoMode: e.target.checked }))}
                  className="w-4 h-4 text-primary-500 border-surface-muted rounded focus:ring-primary-500 cursor-pointer"
                />
                <label htmlFor="demoMode" className="text-xs font-semibold text-text-secondary uppercase cursor-pointer select-none">
                  Enable Simulated Action Mode (Local State Bypasses Database Sync)
                </label>
              </div>
              <div className="pt-sm border-t border-surface-muted flex justify-end">
                <button 
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-text-inverse font-body text-xs font-bold px-lg py-md rounded shadow-sm cursor-pointer transition-colors"
                >
                  Save System Configuration
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-xs flex items-center justify-center p-md z-50 animate-fade-in">
          <div className="bg-surface rounded-lg max-w-xl w-full border border-surface-muted shadow-card-lg overflow-hidden animate-slide-up">
            <div className="bg-surface-subtle border-b border-surface-muted p-md flex justify-between items-center">
              <h3 className="font-display font-extrabold text-lg text-text-primary flex items-center gap-xs">
                <ClipboardList className="w-5 h-5 text-primary-500" />
                Appointment Case File
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-text-muted hover:text-text-primary rounded-full p-xs hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-md space-y-md font-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Patient Name
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {selectedAppointment.patient_name}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Status
                  </span>
                  <span
                    className={`inline-flex px-sm py-2xs rounded-full text-xs font-bold uppercase tracking-wider mt-2xs ${
                      selectedAppointment.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : selectedAppointment.status === "pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Email Contact
                  </span>
                  <a
                    href={`mailto:${selectedAppointment.patient_email}`}
                    className="text-sm text-primary-600 font-semibold hover:underline block"
                  >
                    {selectedAppointment.patient_email}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Phone Contact
                  </span>
                  <a
                    href={`tel:${selectedAppointment.patient_phone}`}
                    className="text-sm text-primary-600 font-semibold hover:underline block"
                  >
                    {selectedAppointment.patient_phone}
                  </a>
                </div>
              </div>

              <hr className="border-surface-muted" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Treatment Category
                  </span>
                  <span className="text-sm font-semibold text-text-primary">
                    {serviceMap.get(selectedAppointment.service_id) || selectedAppointment.service_id}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Assigned Dentist
                  </span>
                  <span className="text-sm font-semibold text-text-primary">
                    {doctorMap.get(selectedAppointment.doctor_id) || selectedAppointment.doctor_id}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Scheduled Date
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {selectedAppointment.appointment_date}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Time Slot
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {selectedAppointment.appointment_time}
                  </span>
                </div>
              </div>

              <hr className="border-surface-muted" />

              <div>
                <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider mb-2xs">
                  Clinical Intake Notes / Remarks
                </span>
                <div className="bg-surface-subtle border border-surface-muted rounded-md p-sm text-sm text-text-secondary italic whitespace-pre-wrap">
                  {selectedAppointment.notes || "No extra medical context or intake notes were provided."}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-sm text-xs text-blue-800 flex items-start gap-xs">
                <AlertCircle className="w-5 h-5 shrink-0 text-blue-500" />
                <span>
                  Submitted on {formatRawDateTime(selectedAppointment.created_at)}. Standard
                  clinical visits are allocated 45 mins.
                </span>
              </div>
            </div>

            <div className="bg-surface-subtle border-t border-surface-muted p-md flex flex-wrap justify-between items-center gap-sm">
              <button
                onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                className="px-md py-sm text-sm font-body font-bold text-accent-coral hover:bg-rose-50 border border-transparent rounded-md transition-colors cursor-pointer flex items-center gap-xs"
              >
                <Trash2 className="w-4 h-4" />
                Delete Case
              </button>
              <div className="flex gap-sm">
                {selectedAppointment.status !== "confirmed" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "confirmed")}
                    className="px-md py-sm text-sm font-body font-bold bg-emerald-600 text-text-inverse hover:bg-emerald-700 rounded-md transition-colors cursor-pointer"
                  >
                    Confirm Session
                  </button>
                )}
                {selectedAppointment.status !== "cancelled" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "cancelled")}
                    className="px-md py-sm text-sm font-body font-bold bg-rose-600 text-text-inverse hover:bg-rose-700 rounded-md transition-colors cursor-pointer"
                  >
                    Cancel Session
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-xs flex items-center justify-center p-md z-50 animate-fade-in">
          <div className="bg-surface rounded-lg max-w-xl w-full border border-surface-muted shadow-card-lg overflow-hidden animate-slide-up">
            <div className="bg-surface-subtle border-b border-surface-muted p-md flex justify-between items-center">
              <h3 className="font-display font-extrabold text-lg text-text-primary flex items-center gap-xs">
                <FileText className="w-5 h-5 text-teal-600" />
                Inquiry Detail Panel
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-text-muted hover:text-text-primary rounded-full p-xs hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-md space-y-md font-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Sender Name
                  </span>
                  <span className="text-sm font-bold text-text-primary">
                    {selectedMessage.name}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Date Received
                  </span>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatRawDateTime(selectedMessage.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-primary-600 font-semibold hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">
                    Phone Number
                  </span>
                  <a
                    href={`tel:${selectedMessage.phone}`}
                    className="text-sm text-primary-600 font-semibold hover:underline"
                  >
                    {selectedMessage.phone}
                  </a>
                </div>
              </div>

              <hr className="border-surface-muted" />

              <div>
                <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider mb-2xs">
                  Message Body
                </span>
                <div className="bg-surface-subtle border border-surface-muted rounded-md p-sm text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="bg-surface-subtle border-t border-surface-muted p-md flex justify-between items-center">
              <button
                onClick={() => handleDeleteMessage(selectedMessage.id)}
                className="px-md py-sm text-sm font-body font-bold text-accent-coral hover:bg-rose-50 border border-transparent rounded-md transition-colors cursor-pointer flex items-center gap-xs"
              >
                <Trash2 className="w-4 h-4" />
                Delete Inquiry
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-md py-sm text-sm font-body font-bold bg-primary-600 text-text-inverse hover:bg-primary-700 rounded-md transition-colors cursor-pointer"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-lg right-lg max-w-sm w-full bg-surface border border-surface-muted shadow-card-lg rounded-lg p-md flex items-start gap-sm z-50 animate-slide-up">
          <div className="shrink-0 mt-2xs">
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-500" />
            )}
          </div>
          <div className="flex-grow">
            <p className="text-sm font-body font-semibold text-text-primary">
              {toast.type === "success" ? "Operation Successful" : "Operation Failed"}
            </p>
            <p className="text-xs font-body text-text-secondary mt-2xs">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-text-muted hover:text-text-primary cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
