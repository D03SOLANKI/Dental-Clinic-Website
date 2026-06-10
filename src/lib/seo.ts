import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description,
  path,
  ogImage = "/images/hero_dentist.png",
  noIndex = false,
}: SEOProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brightsmiledental.com";
  const canonicalUrl = `${siteUrl}${path}`;
  const fullTitle = `${title} | Aura Dental Care`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: "Aura Dental Care",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${title} - Aura Dental Care`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
