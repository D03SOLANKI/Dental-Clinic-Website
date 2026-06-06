"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Simulate API call
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-text-primary text-text-inverse pt-3xl pb-xl px-md sm:px-lg border-t border-slate-800">
      <div className="mx-auto max-w-7xl">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-xl sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-md">
            <Link
              href="/"
              className="inline-block font-display text-2xl font-bold tracking-tight text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
              aria-label="SmileCraft Dental Clinic Homepage"
            >
              Smile<span className="text-primary-500">Craft</span>
            </Link>
            <p className="font-body text-sm text-text-muted leading-relaxed">
              Gentle Care. Confident Smiles. Experience premium digital dentistry using state-of-the-art dental technology in Ahmedabad.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-md mt-xs">
              <a
                href="https://instagram.com/smilecraftdental"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-md p-1"
                aria-label="Follow SmileCraft on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/smilecraftdental"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-md p-1"
                aria-label="Follow SmileCraft on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@smilecraftdental"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-md p-1"
                aria-label="Subscribe to SmileCraft on YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/smilecraftdental"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-primary-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-md p-1"
                aria-label="Connect with SmileCraft on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-md">
            <h3 className="font-display text-sm font-semibold tracking-wider uppercase text-text-inverse">
              Quick Links
            </h3>
            <nav aria-label="Footer quick links" className="flex flex-col gap-sm">
              <Link
                href="/about"
                className="font-body text-sm text-text-muted hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
              >
                About Us
              </Link>
              <Link
                href="/services"
                className="font-body text-sm text-text-muted hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
              >
                Our Services
              </Link>
              <Link
                href="/doctors"
                className="font-body text-sm text-text-muted hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
              >
                Meet the Doctors
              </Link>
              <Link
                href="/gallery"
                className="font-body text-sm text-text-muted hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
              >
                Clinic Gallery
              </Link>
              <Link
                href="/before-after"
                className="font-body text-sm text-text-muted hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
              >
                Before & After cases
              </Link>
              <Link
                href="/faq"
                className="font-body text-sm text-text-muted hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
              >
                FAQs
              </Link>
            </nav>
          </div>

          {/* Column 3: Contact Details */}
          <div className="flex flex-col gap-md">
            <h3 className="font-display text-sm font-semibold tracking-wider uppercase text-text-inverse">
              Contact Info
            </h3>
            <ul className="flex flex-col gap-sm font-body text-sm text-text-muted">
              <li className="flex items-start gap-xs">
                <MapPin className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=Ahmedabad+Dental+Clinic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
                >
                  402, Shivalik Square, Near Iskcon Cross Road, SG Highway, Ahmedabad, Gujarat 380015
                </a>
              </li>
              <li className="flex items-center gap-xs">
                <Phone className="h-5 w-5 text-primary-500 shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-xs">
                <Mail className="h-5 w-5 text-primary-500 shrink-0" />
                <a
                  href="mailto:contact@smilecraftdental.com"
                  className="hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
                >
                  contact@smilecraftdental.com
                </a>
              </li>
              <li className="flex items-start gap-xs">
                <Clock className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-text-inverse font-medium">Hours:</span>
                  <span className="block">Mon–Sat: 9:00 AM – 8:00 PM</span>
                  <span className="block text-accent-coral font-medium">Sun: Emergency appointments only</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Sign-up */}
          <div className="flex flex-col gap-md">
            <h3 className="font-display text-sm font-semibold tracking-wider uppercase text-text-inverse">
              Newsletter
            </h3>
            <p className="font-body text-sm text-text-muted leading-relaxed">
              Subscribe to get updates on dental health tips, checkup offers, and news from our specialists.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-xs mt-xs">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  aria-label="Email address for newsletter"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 text-text-inverse border border-slate-700 rounded-md py-sm pl-md pr-xl text-sm placeholder-slate-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-xs top-1/2 -translate-y-1/2 bg-primary-500 text-text-inverse p-xs rounded-md hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {error && (
                <p role="alert" className="text-xs text-accent-coral font-medium">
                  {error}
                </p>
              )}
              {subscribed && (
                <p role="status" className="text-xs text-accent-mint font-medium">
                  Subscribed successfully! Thank you.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-2xl pt-lg border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-md text-xs text-text-muted font-body">
          <p>© {new Date().getFullYear()} SmileCraft Dental Clinic. All rights reserved.</p>
          <div className="flex items-center gap-md">
            <Link
              href="/privacy-policy"
              className="hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:text-text-inverse transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
