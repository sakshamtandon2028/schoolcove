import { q, rateLimit } from "@/lib/db";

// Counts a page view for a school. Called from the browser so school pages themselves can be cached.
export async function POST(req: Request) {
  const slug = (await req.text()).slice(0, 120);
  if (!/^[a-z0-9-]+$/.test(slug)) return new Response(null, { status: 400 });
  const ip = (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
  if (await rateLimit(`view:${ip}:${slug}`, 3, 3600)) await q(`update schools set views=views+1 where slug=$1`, [slug]);
  return new Response(null, { status: 204 });
}
