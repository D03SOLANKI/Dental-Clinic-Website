"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { useUI } from "@/providers/UIProvider";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Doctors", href: "/doctors" },
  { name: "Gallery", href: "/gallery" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useUI();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Handle keyboard accessibility (Escape key to close menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setMobileMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, setMobileMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const menuEl = mobileMenuRef.current;
    if (!menuEl) return;

    const focusableEls = menuEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    menuEl.addEventListener("keydown", handleTabTrap);
    firstFocusable?.focus();

    return () => menuEl.removeEventListener("keydown", handleTabTrap);
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-muted/80 bg-surface/85 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-md py-md sm:px-lg">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm"
          aria-label="SmileCraft Dental Clinic Homepage"
        >
          <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Smile<span className="text-primary-500">Craft</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-body text-sm font-medium transition-colors hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm px-xs py-1 ${
                  isActive ? "text-primary-600 font-semibold" : "text-text-secondary"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavLine"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-primary-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden lg:flex items-center gap-md">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-xs font-body text-sm font-semibold text-text-secondary hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 rounded-sm py-1 px-xs"
            aria-label="Call SmileCraft Dental Clinic at +91 98765 43210"
          >
            <Phone className="h-4 w-4 text-primary-500" />
            +91 98765 43210
          </a>
          <Link
            href="/book"
            className="flex items-center gap-xs bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-text-inverse font-body text-sm font-semibold px-lg py-md rounded-md shadow-card transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            <Calendar className="h-4 w-4" />
            Book Appointment
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          ref={triggerRef}
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-surface-muted text-text-secondary hover:bg-surface-subtle hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 lg:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Slide-over Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-text-primary/60 lg:hidden"
            />

            {/* Content Drawer */}
            <motion.div
              id="mobile-navigation"
              ref={mobileMenuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-surface p-xl shadow-card-lg flex flex-col justify-between lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-xl">
                  <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
                    Smile<span className="text-primary-500">Craft</span>
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-surface-muted text-text-secondary hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Links */}
                <nav className="flex flex-col gap-md">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`font-body text-base font-medium py-sm border-b border-surface-muted transition-colors ${
                          isActive ? "text-primary-600 font-bold" : "text-text-primary hover:text-primary-600"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-md pt-lg border-t border-surface-muted">
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-xs font-body text-base font-semibold text-text-primary py-sm rounded-md border border-surface-muted hover:bg-surface-subtle"
                >
                  <Phone className="h-5 w-5 text-primary-500" />
                  +91 98765 43210
                </a>
                <Link
                  href="/book"
                  className="flex items-center justify-center gap-xs bg-primary-500 text-text-inverse font-body text-base font-semibold py-md rounded-md shadow-card hover:bg-primary-600"
                >
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
