"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Phone, Calendar, Instagram, Facebook, Clock } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  // Ensure client-side rendering before using React Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Lock body scroll and prevent touch moves on mobile when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.height = "";
    };
  }, [isMobileMenuOpen]);

  // Escape key listener to close mobile menu
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

  // Focus trap for mobile navigation drawer
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

  // Stagger animation variants for links
  const containerVariants = {
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    },
    closed: {
      transition: { staggerChildren: 0.03, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } }
    },
    closed: {
      y: 20,
      opacity: 0,
      transition: { y: { stiffness: 1000 } }
    }
  };

  const mobileMenu = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop covering the entire viewport, sitting directly on document.body */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-text-primary/70 backdrop-blur-md lg:hidden"
            style={{ zIndex: 99998, position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Full-Screen Drawer Menu Panel */}
          <motion.div
            key="mobile-drawer"
            id="mobile-navigation"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-full sm:max-w-[448px] h-dvh bg-surface p-xl flex flex-col justify-between shadow-card-lg lg:hidden"
            style={{
              zIndex: 99999,
              position: "fixed",
              boxSizing: "border-box"
            }}
          >
            {/* Header section with brand logo and X close button */}
            <div>
              <div className="flex items-center justify-between pb-lg border-b border-surface-muted">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-xs"
                >
                  <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
                    Smile<span className="text-primary-500">Craft</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-surface-muted text-text-secondary hover:bg-surface-subtle hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation links with stagger animation */}
              <motion.nav
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col gap-xs mt-xl"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div key={link.name} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block font-body text-xl font-semibold py-md border-b border-surface-muted/50 transition-colors hover:text-primary-500 ${
                          isActive ? "text-primary-600 font-bold" : "text-text-primary"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>
            </div>

            {/* Bottom contact information and primary CTAs */}
            <div className="flex flex-col gap-lg pt-lg border-t border-surface-muted mt-auto">
              <div className="flex flex-col gap-sm text-sm text-text-secondary font-body">
                <div className="flex items-center gap-sm">
                  <Clock className="h-4 w-4 text-primary-500" />
                  <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex items-center gap-sm">
                  <Phone className="h-4 w-4 text-primary-500" />
                  <a href="tel:+919876543210" className="hover:text-primary-600 transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Social and Main CTA button */}
              <div className="flex flex-col gap-md">
                <Link
                  href="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-xs bg-primary-500 text-text-inverse font-body text-base font-bold py-md rounded-md shadow-card hover:bg-primary-600 active:bg-primary-700 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-500"
                >
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </Link>

                <div className="flex items-center justify-center gap-lg text-text-secondary mt-sm">
                  <a href="#" className="hover:text-primary-500 transition-colors" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="hover:text-primary-500 transition-colors" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
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

          {/* Desktop Call-to-actions */}
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
      </header>

      {/* Render Portal: renders directly inside the body element */}
      {mounted && createPortal(mobileMenu, document.body)}
    </>
  );
}
