import Link from "next/link";
import { Suspense } from "react";
import { allSchools, distanceKm } from "@/lib/schools";
import SchoolCard from "@/components/SchoolCard";
import NearMe from "@/components/NearMe";
import { Tip } from "@/components/bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Preschools and daycares in Gurugram" };

type SP = { q?: string; type?: string; daycare?: string; age?: string; sort?: string; lat?: string; lng?: string };
const AGES: [string, string, number][] = [["u1", "Under 1 year", 6], ["1", "1 to 2 years", 18], ["2", "2 to 3 years", 30], ["3", "3 years and above", 42]];

export default async function SchoolsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const all = await allSchools();
  const q = (sp.q || "").trim().toLowerCase();
  const lat = Number(sp.lat), lng = Number(sp.lng);
  const hasLoc = sp.sort === "near" && Number.isFinite(lat) && Number.isFinite(lng) && !!sp.lat;
  const ageMonths = AGES.find((a) => a[0] === sp.age)?.[2];

  let list = all
    .filter((s) => !q || `${s.name} ${s.locality} ${s.address} ${s.data.curriculum || ""}`.toLowerCase().includes(q))
    .filter((s) => !sp.type || s.kind === sp.type)
    .filter((s) => sp.daycare !== "1" || s.has_daycare)
    .filter((s) => ageMonths == null || s.min_age_months == null || s.min_age_months <= ageMonths)
    .map((s) => ({ s, dist: hasLoc && s.lat != null && s.lng != null ? distanceKm(lat, lng, s.lat, s.lng) : null }));
  if (hasLoc) list = list.sort((a, b) => (a.dist ?? 1e9) - (b.dist ?? 1e9));

  const link = (patch: Partial<SP>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...patch })) if (v) p.set(k, String(v));
    return `/schools${p.size ? `?${p}` : ""}`;
  };
  const Pill = ({ on, href, children }: { on: boolean; href: string; children: React.ReactNode }) => (
    <Link href={href} scroll={false} aria-current={on ? "true" : undefined} className={`btn !min-h-10 !px-4 ${on ? "btn-primary" : "btn-ghost"}`}>{children}</Link>
  );
  const filtered = !!(q || sp.type || sp.daycare || sp.age);

  return (
    <div className="container-x pt-8">
      <p className="eyebrow">Gurugram</p>
      <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">Preschools and daycares</h1>
      <p className="mt-2 max-w-2xl text-muted">Every profile uses information the school itself has published. Where a school has not shared something, we leave it out and tell you what to ask.</p>

      <div className="card mt-6 space-y-4 p-4 sm:p-5">
        <form action="/schools" className="flex items-center gap-2 rounded-2xl border border-line bg-white px-4">
          <span aria-hidden="true">🔍</span>
          <input name="q" defaultValue={sp.q || ""} aria-label="Search" placeholder="Area, sector or school name" className="min-h-12 w-full bg-transparent text-base outline-none" />
          {sp.type && <input type="hidden" name="type" value={sp.type} />}
          {sp.daycare && <input type="hidden" name="daycare" value={sp.daycare} />}
          {sp.age && <input type="hidden" name="age" value={sp.age} />}
          <button className="btn btn-primary !min-h-10 shrink-0">Search</button>
        </form>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-full text-xs font-bold uppercase tracking-wide text-muted sm:w-24">Type</span>
          <Pill on={!sp.type} href={link({ type: "" })}>All</Pill>
          <Pill on={sp.type === "preschool"} href={link({ type: "preschool" })}>Preschool & daycare</Pill>
          <Pill on={sp.type === "school"} href={link({ type: "school" })}>School with pre-primary</Pill>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-full text-xs font-bold uppercase tracking-wide text-muted sm:w-24">Child's age</span>
          <Pill on={!sp.age} href={link({ age: "" })}>Any</Pill>
          {AGES.map(([k, label]) => <Pill key={k} on={sp.age === k} href={link({ age: k })}>{label}</Pill>)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-full text-xs font-bold uppercase tracking-wide text-muted sm:w-24">More</span>
          <Pill on={sp.daycare === "1"} href={link({ daycare: sp.daycare === "1" ? "" : "1" })}>🧸 Has daycare</Pill>
          <Suspense><NearMe /></Suspense>
          {filtered && <Link href="/schools" className="text-sm font-semibold text-coral hover:underline">Clear filters</Link>}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" role="status">{list.length} {list.length === 1 ? "school" : "schools"} found{hasLoc ? ", nearest first. Distances are straight-line and approximate." : "."}</p>

      {list.length ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map(({ s, dist }, i) => <div key={s.id} data-reveal="" style={{ ["--d" as string]: `${Math.min(i, 5) * 60}ms` }} className="flex"><div className="flex w-full [&>article]:w-full"><SchoolCard school={s} distance={dist} /></div></div>)}</div>
      ) : (
        <div className="card mt-4 p-10 text-center">
          <p className="text-4xl" aria-hidden="true">🔍</p>
          <p className="mt-3 font-display text-2xl font-semibold">No schools match these filters</p>
          <p className="mt-1 text-sm text-muted">Try removing a filter or searching a nearby area.</p>
          <Link href="/schools" className="btn btn-primary mt-4">Show all schools</Link>
        </div>
      )}

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Tip emoji="💡" title="Shortlist three, visit two">Use Compare to narrow down, then visit your top two in person before deciding.</Tip>
        <Tip emoji="🕘" title="Check timings against your day" tone="bg-lavender">Daycare hours and preschool hours are often different. Ask for both.</Tip>
        <Tip emoji="📋" title="Not sure what to ask?" tone="bg-mint"><Link href="/guide" className="font-semibold text-coral hover:underline">Open the parent guide</Link> for a visit checklist.</Tip>
      </div>
    </div>
  );
}
