import type { MetadataRoute } from "next";
import { verticals } from "@/content/verticals";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "/", priority: 1 },
    { path: "/verticals", priority: 0.9 },
    { path: "/what-you-receive", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.9 },
    { path: "/privacy", priority: 0.2 },
  ];

  return [
    ...routes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...verticals.map((v) => ({
      url: `${SITE_URL}/verticals/${v.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
