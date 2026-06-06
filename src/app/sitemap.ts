import { MetadataRoute } from "next";
import { services, doctors } from "@/lib/mockData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.smilecraftdental.com";

  // Static routes
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/doctors",
    "/book",
    "/contact",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes
  staticRoutes.forEach((route) => {
    sitemapEntries.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1.0 : route === "/book" ? 0.9 : 0.8,
    });
  });

  // Add dynamic services
  services.forEach((service) => {
    sitemapEntries.push({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  // Add dynamic doctors
  doctors.forEach((doctor) => {
    sitemapEntries.push({
      url: `${baseUrl}/doctors/${doctor.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  return sitemapEntries;
}
