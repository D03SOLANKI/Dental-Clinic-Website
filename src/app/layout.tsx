import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { UIProvider } from "@/providers/UIProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SmileCraft Dental Clinic",
    default: "SmileCraft Dental Clinic | Premium Dental Care Ahmedabad",
  },
  description: "SmileCraft Dental Clinic offers gentle, advanced pain-free digital dental treatments, including implants, orthodontics, teeth whitening, and smile makeovers in Ahmedabad.",
  keywords: [
    "Best Dental Clinic in Ahmedabad",
    "Dental Implants Ahmedabad",
    "Root Canal Specialist Ahmedabad",
    "Teeth Whitening Clinic",
    "Emergency Dentist Ahmedabad",
    "Smile Makeover Clinic",
  ],
  metadataBase: new URL("https://www.smilecraftdental.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SmileCraft Dental Clinic | Gentle Care. Confident Smiles.",
    description: "Experience premium digital dentistry in Ahmedabad. Gentle care, pain-free treatments, and confident smiles designed by our expert specialists.",
    url: "https://www.smilecraftdental.com",
    siteName: "SmileCraft Dental Clinic",
    locale: "en-IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmileCraft Dental Clinic | Premium Dental Care",
    description: "Experience premium digital dentistry in Ahmedabad. Gentle care, pain-free treatments, and confident smiles.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-surface text-text-primary font-body">
        <UIProvider>
          {children}
        </UIProvider>
      </body>
    </html>
  );
}
