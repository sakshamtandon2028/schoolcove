import { q } from "./db";
import type { School } from "./types";

export async function allSchools(): Promise<School[]> {
  return q<School>(`select * from schools order by choice desc, promoted desc, partner desc, (jsonb_array_length(data->'images')>0) desc, name asc, locality asc`);
}
export async function schoolBySlug(slug: string): Promise<School | null> {
  return (await q<School>(`select * from schools where slug=$1`, [slug]))[0] || null;
}
export async function schoolById(id: number): Promise<School | null> {
  return (await q<School>(`select * from schools where id=$1`, [id]))[0] || null;
}

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371, rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(bLat - aLat), dLng = rad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const mapsQuery = (s: Pick<School, "name" | "address">) => encodeURIComponent(`${s.name}, ${s.address}`);
export const googleMapsUrl = (s: Pick<School, "name" | "address">) => `https://www.google.com/maps/search/?api=1&query=${mapsQuery(s)}`;
export const appleMapsUrl = (s: Pick<School, "name" | "address" | "lat" | "lng">) =>
  `https://maps.apple.com/?q=${encodeURIComponent(s.name)}&address=${encodeURIComponent(s.address)}`;
export const directionsUrl = (s: Pick<School, "name" | "address">) => `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery(s)}`;
export const embedMapUrl = (s: Pick<School, "name" | "address">) => `https://www.google.com/maps?q=${mapsQuery(s)}&output=embed`;

export function ageLabel(months: number | null) {
  if (months == null) return null;
  return months < 24 ? `${months} months` : `${Math.round((months / 12) * 10) / 10} years`.replace(".0", "");
}
export const rupees = (n: number) => "₹" + n.toLocaleString("en-IN");
