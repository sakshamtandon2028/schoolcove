import type { School } from "./types";

export type GoogleInfo = {
  rating?: number; count?: number; url?: string;
  reviews: { author: string; rating: number; text: string; when: string; authorUrl?: string }[];
  live: boolean;
};

// Uses the official Google Places API when GOOGLE_PLACES_API_KEY is set. Results are cached for a day.
export async function googleInfo(s: School): Promise<GoogleInfo> {
  const fallback: GoogleInfo = { rating: s.data.google?.rating, count: s.data.google?.count, reviews: [], live: false };
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return fallback;
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id,places.rating,places.userRatingCount,places.googleMapsUri,places.reviews",
      },
      body: JSON.stringify({ textQuery: `${s.name}, ${s.address}`, maxResultCount: 1 }),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return fallback;
    const p = (await res.json()).places?.[0];
    if (!p) return fallback;
    return {
      rating: p.rating, count: p.userRatingCount, url: p.googleMapsUri, live: true,
      reviews: (p.reviews || []).map((r: any) => ({
        author: r.authorAttribution?.displayName || "Google user",
        authorUrl: r.authorAttribution?.uri,
        rating: r.rating,
        text: r.text?.text || r.originalText?.text || "",
        when: r.relativePublishTimeDescription || "",
      })).filter((r: any) => r.text),
    };
  } catch {
    return fallback;
  }
}
