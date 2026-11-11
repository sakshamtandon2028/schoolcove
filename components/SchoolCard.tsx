import Link from "next/link";
import type { School } from "@/lib/types";
import { ageLabel, rupees } from "@/lib/schools";
import { SchoolImage, Stars } from "./bits";
import { CompareToggle } from "./Compare";

export default function SchoolCard({ school, distance }: { school: School; distance?: number | null }) {
  const d = school.data;
  return (
    <article className="card card-lift flex flex-col overflow-hidden">
      <Link href={`/schools/${school.slug}`} aria-label={`${school.name}, ${school.locality}`} className="relative block overflow-hidden">
        <SchoolImage school={school} className="zoom h-44 w-full" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {school.choice && <span className="chip choice-ribbon text-white shadow">🏅 SchoolCove's Choice</span>}
          {school.promoted && <span className="chip bg-coral text-white">🚀 Promoted</span>}
          {school.partner && <span className="chip bg-white text-ink shadow">✓ Verified by school</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/schools/${school.slug}`}><h3 className="font-display text-xl font-semibold leading-snug hover:text-coral">{school.name}</h3></Link>
        <p className="mt-1 text-sm text-muted">📍 {school.locality}, Gurugram{distance != null && <span className="font-semibold text-ink"> · {distance.toFixed(1)} km away</span>}</p>
        {d.google?.rating && <p className="mt-2 flex items-center gap-1.5 text-sm"><Stars value={d.google.rating} /> <b>{d.google.rating}</b>{d.google.count ? <span className="text-muted">({d.google.count} Google reviews)</span> : null}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="chip bg-lavender">{school.kind === "school" ? "School with pre-primary" : "Preschool"}</span>
          {school.has_daycare && <span className="chip bg-mint">Daycare</span>}
          {school.min_age_months != null && <span className="chip bg-sun">From {ageLabel(school.min_age_months)}</span>}
          {d.curriculum && <span className="chip bg-blush">{d.curriculum.split(",")[0]}</span>}
        </div>
        {d.tagline && <p className="mt-3 text-sm leading-6 text-ink/80">{d.tagline}</p>}
        {school.fee_from != null && <p className="mt-2 text-sm font-semibold">💰 From {rupees(school.fee_from)} / month</p>}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Link href={`/schools/${school.slug}`} className="btn btn-primary flex-1">View details <span className="nudge" aria-hidden="true">→</span></Link>
          <CompareToggle slug={school.slug} />
        </div>
      </div>
    </article>
  );
}
