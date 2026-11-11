import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/blog";
import { SEED_SCHOOLS } from "@/lib/seed";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/schools`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/for-schools`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    ...SEED_SCHOOLS.map((s) => ({ url: `${SITE}/schools/${s.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...POSTS.map((p) => ({ url: `${SITE}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
