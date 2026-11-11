import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { q } from "@/lib/db";
import { schoolBySlug, googleMapsUrl, appleMapsUrl, directionsUrl, embedMapUrl, ageLabel, mapsQuery } from "@/lib/schools";
import { googleInfo } from "@/lib/google";
import type { Review } from "@/lib/types";
import { SchoolImage, Stars, Tip } from "@/components/bits";
import { CompareToggle } from "@/components/Compare";
import LeadForm from "@/components/LeadForm";
import ReviewForm from "@/components/ReviewForm";
import Tabs from "@/components/Tabs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = await schoolBySlug((await params).slug);
  if (!s) return { title: "School not found" };
  return { title: `${s.name}, ${s.locality}`, description: s.data.tagline || s.data.about.slice(0, 150) };
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="card p-5 sm:p-7"><h2 className="text-2xl font-semibold">{title}</h2><div className="mt-4">{children}</div></section>
);
const List = ({ items, mark, tone }: { items: string[]; mark: string; tone: string }) => (
  <ul className="space-y-2">{items.map((i) => <li key={i} className="flex gap-2.5 text-sm leading-6"><span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs ${tone}`} aria-hidden="true">{mark}</span><span>{i}</span></li>)}</ul>
);

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const school = await schoolBySlug((await params).slug);
  if (!school) notFound();
  const d = school.data;
  await q(`update schools set views=views+1 where id=$1`, [school.id]);
  const [google, reviews] = await Promise.all([
    googleInfo(school),
    q<Review>(`select * from reviews where school_id=$1 and status='approved' order by created_at desc`, [school.id]),
  ]);
  const programNames = [...d.programs.map((p) => p.name), ...(school.has_daycare && !d.programs.some((p) => /day ?care/i.test(p.name)) ? ["Daycare"] : [])];
  const lead = (label?: string, className?: string) => <LeadForm schoolId={school.id} schoolName={`${school.name}, ${school.locality}`} programs={programNames} label={label} className={className} />;
  const ownAvg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;
  const googleReviewsUrl = google.url || googleMapsUrl(school);

  const facts: [string, string | undefined | null][] = [
    ["Type", school.kind === "school" ? "School with pre-primary classes" : "Preschool" + (school.has_daycare ? " and daycare" : "")],
    ["Classes", d.grades],
    ["Curriculum", d.curriculum],
    ["Youngest age", ageLabel(school.min_age_months)],
    ["Timings", d.hours],
    ["Established", d.established ? String(d.established) : null],
    ["Staff ratio", d.ratio],
  ];

  const overview = (
    <div className="space-y-5">
      <Section title="About">
        <p className="leading-7 text-ink/85">{d.about}</p>
        {d.network && <p className="mt-3 rounded-2xl bg-lavender p-3 text-sm leading-6">🤝 {d.network}</p>}
        <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {facts.filter(([, v]) => v).map(([k, v]) => (<div key={k} className="flex justify-between gap-4 border-b border-line pb-2 text-sm"><dt className="text-muted">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>))}
        </dl>
      </Section>

      <Section title="At a glance">
        <p className="-mt-2 mb-4 text-sm text-muted">SchoolCove's notes, based on what the school has published.</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-mint/60 p-4"><p className="mb-2 text-sm font-bold">👍 What stands out</p><List items={d.highlights.works} mark="✓" tone="bg-white text-emerald-700" /></div>
          <div className="rounded-2xl bg-sun p-4"><p className="mb-2 text-sm font-bold">👀 What to check</p><List items={d.highlights.watch} mark="!" tone="bg-white text-amber-700" /></div>
          <div className="rounded-2xl bg-lavender/70 p-4"><p className="mb-2 text-sm font-bold">💬 What to ask</p><List items={d.highlights.ask} mark="?" tone="bg-white text-indigo-700" /></div>
        </div>
      </Section>

      <Section title="Programmes">
        <div className="grid gap-3 sm:grid-cols-2">
          {d.programs.map((p) => (
            <div key={p.name} className="rounded-2xl border border-line p-4">
              <p className="font-bold">{p.name}</p>
              {p.age && <p className="mt-0.5 text-sm text-coral">{p.age}</p>}
              {p.note && <p className="mt-1 text-sm leading-6 text-muted">{p.note}</p>}
            </div>
          ))}
        </div>
        {d.daycare && (d.daycare.hours || d.daycare.ages || d.daycare.note) && (
          <div className="mt-4 rounded-2xl bg-mint/60 p-4 text-sm leading-6">
            <p className="font-bold">🧸 Daycare</p>
            {d.daycare.hours && <p>Hours: {d.daycare.hours}</p>}
            {d.daycare.ages && <p>Ages: {d.daycare.ages}</p>}
            {d.daycare.note && <p className="text-ink/80">{d.daycare.note}</p>}
          </div>
        )}
      </Section>

      {(d.facilities.length > 0 || d.activities?.length) && (
        <Section title="Facilities and activities">
          {d.facilities.length > 0 && <div className="flex flex-wrap gap-2">{d.facilities.map((f) => <span key={f} className="chip bg-white border border-line !text-sm !font-medium">✓ {f}</span>)}</div>}
          {d.activities && d.activities.length > 0 && (<><p className="mb-2 mt-5 text-sm font-bold">Activities</p><div className="flex flex-wrap gap-2">{d.activities.map((f) => <span key={f} className="chip bg-blush !text-sm !font-medium">{f}</span>)}</div></>)}
        </Section>
      )}

      {(d.safety?.length || d.meals || d.transport) && (
        <Section title="Safety, meals and transport">
          <div className="grid gap-4 sm:grid-cols-3">
            {d.safety && d.safety.length > 0 && <div><p className="mb-2 text-sm font-bold">🛡️ Safety</p><List items={d.safety} mark="✓" tone="bg-mint text-emerald-700" /></div>}
            {d.meals && <div><p className="mb-2 text-sm font-bold">🍎 Meals</p><p className="text-sm leading-6">{d.meals}</p></div>}
            {d.transport && <div><p className="mb-2 text-sm font-bold">🚌 Transport</p><p className="text-sm leading-6">{d.transport}</p></div>}
          </div>
        </Section>
      )}

      {d.awards && d.awards.length > 0 && <Section title="Awards"><List items={d.awards} mark="🏆" tone="" /></Section>}

      {d.images.length > 1 && (
        <Section title="Photos">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{d.images.map((src, i) => <a key={src} href={src} target="_blank" rel="noreferrer"><img src={src} alt={`${school.name} photo ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" /></a>)}</div>
          <p className="mt-3 text-xs text-muted">Photos are from the school.</p>
        </Section>
      )}
    </div>
  );

  const fees = (
    <div className="space-y-5">
      <Section title="Fees">
        {d.fees ? (
          <>
            <div className="overflow-hidden rounded-2xl border border-line">
              {d.fees.items.map((f, i) => (<div key={f.label} className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${i % 2 ? "bg-bg" : "bg-white"}`}><span>{f.label}</span><span className="shrink-0 font-bold">{f.amount}</span></div>))}
            </div>
            {d.fees.note && <p className="mt-3 text-sm text-muted">{d.fees.note}</p>}
          </>
        ) : (
          <div className="rounded-2xl bg-sun p-5">
            <p className="font-bold">This school has not published its fees.</p>
            <p className="mt-1 text-sm leading-6 text-ink/80">We only show fees that come from the school. Ask for the fee card and the admissions team will share it with you.</p>
            <div className="mt-4 max-w-xs">{lead("💰 Ask for the fee card")}</div>
          </div>
        )}
      </Section>
      <div className="grid gap-3 sm:grid-cols-2">
        <Tip emoji="✅" title="Do ask what the fee includes" tone="bg-mint">Meals, daycare hours, activities, uniform, books and transport are often billed separately.</Tip>
        <Tip emoji="🚫" title="Don't compare monthly fees alone" tone="bg-blush">Add one-time admission charges and deposits, then compare the first-year total.</Tip>
      </div>
    </div>
  );

  const admission = (
    <div className="space-y-5">
      <Section title="Admission">
        {d.admission?.status && <p className="mb-4 inline-flex rounded-full bg-mint px-4 py-2 text-sm font-semibold">🟢 {d.admission.status}</p>}
        {d.admission?.steps?.length ? (
          <ol className="space-y-3">{d.admission.steps.map((s, i) => (<li key={s} className="flex gap-3 text-sm leading-6"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">{i + 1}</span><span className="pt-0.5">{s}</span></li>))}</ol>
        ) : <p className="text-sm leading-6 text-muted">The school has not published its admission steps. Share your interest and the admissions team will guide you.</p>}
        {d.admission?.documents?.length ? (<><p className="mb-2 mt-6 text-sm font-bold">📄 Documents to keep ready</p><List items={d.admission.documents} mark="•" tone="" /></>) : null}
        {d.admission?.note && <p className="mt-4 text-sm text-muted">{d.admission.note}</p>}
        <div className="mt-5 max-w-xs">{lead("📝 Start an admission enquiry")}</div>
      </Section>
      <div className="grid gap-3 sm:grid-cols-2">
        <Tip emoji="✅" title="Do book a visit before paying" tone="bg-mint">See a classroom in session, the washrooms and the play area. Ask to meet the class teacher.</Tip>
        <Tip emoji="🚫" title="Don't pay a booking amount under pressure" tone="bg-blush">"Only two seats left" is a common line. Ask for the refund policy in writing first.</Tip>
      </div>
    </div>
  );

  const reviewsTab = (
    <div className="space-y-5">
      <Section title="Google reviews">
        <div className="flex flex-wrap items-center gap-5">
          {google.rating ? (
            <div className="flex items-center gap-3"><span className="font-display text-5xl font-semibold">{google.rating.toFixed(1)}</span><div><Stars value={google.rating} size="text-xl" /><p className="text-sm text-muted">{google.count ? `${google.count.toLocaleString("en-IN")} reviews on Google` : "Rating on Google"}</p></div></div>
          ) : <p className="max-w-md text-sm leading-6 text-muted">See this school's current star rating and every parent review on Google Maps.</p>}
          <a href={googleReviewsUrl} target="_blank" rel="noreferrer" className="btn btn-primary">⭐ Read all reviews on Google</a>
        </div>
        {google.reviews.length > 0 && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {google.reviews.map((r, i) => (
              <article key={i} className="rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between gap-2"><Stars value={r.rating} /><span className="text-xs text-muted">{r.when}</span></div>
                <p className="mt-2 text-sm leading-6">{r.text}</p>
                <p className="mt-2 text-sm font-bold">{r.authorUrl ? <a href={r.authorUrl} target="_blank" rel="noreferrer">{r.author}</a> : r.author} <span className="font-normal text-muted">· via Google</span></p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section title="Parent reviews on SchoolCove">
        {ownAvg != null && <p className="mb-4 flex items-center gap-2"><Stars value={ownAvg} size="text-xl" /><b>{ownAvg.toFixed(1)}</b><span className="text-sm text-muted">from {reviews.length} SchoolCove {reviews.length === 1 ? "review" : "reviews"}</span></p>}
        {reviews.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {reviews.map((r) => (<article key={r.id} className="rounded-2xl border border-line p-4"><Stars value={r.rating} /><p className="mt-2 text-sm leading-6">{r.body}</p><p className="mt-2 text-sm font-bold">{r.name}</p></article>))}
          </div>
        ) : <p className="text-sm text-muted">No reviews here yet. If your child goes to this school, be the first to share your experience.</p>}
        <details className="mt-5 rounded-2xl bg-bg p-4">
          <summary className="cursor-pointer text-sm font-bold">✍️ Write a review</summary>
          <div className="mt-4"><ReviewForm schoolId={school.id} /></div>
        </details>
      </Section>
      <Tip emoji="💡" title="How to read reviews">Look for patterns, not one-off stories. Recent reviews about teachers, safety and communication tell you the most.</Tip>
    </div>
  );

  const location = (
    <div className="space-y-5">
      <Section title="Location">
        <p className="text-sm leading-6">📍 {school.address}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={googleMapsUrl(school)} target="_blank" rel="noreferrer" className="btn btn-primary">🗺️ Open in Google Maps</a>
          <a href={appleMapsUrl(school)} target="_blank" rel="noreferrer" className="btn btn-ghost"> Open in Apple Maps</a>
          <a href={directionsUrl(school)} target="_blank" rel="noreferrer" className="btn btn-ghost">🚗 Get directions</a>
        </div>
        <iframe title={`Map of ${school.name}`} src={embedMapUrl(school)} loading="lazy" className="mt-5 h-80 w-full rounded-2xl border border-line" referrerPolicy="no-referrer-when-downgrade" />
      </Section>
      <Tip emoji="🚗" title="Do a trial run at drop-off time" tone="bg-lavender">Check the route at 8:30 am and again at pick-up time. Ask where parents can stop safely at the gate.</Tip>
    </div>
  );

  return (
    <div className="container-x pt-6">
      <p className="text-sm"><Link href="/schools" className="font-semibold text-muted hover:text-coral">← All schools</Link></p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-3xl"><SchoolImage school={school} className="h-56 w-full sm:h-80" /></div>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {school.promoted && <span className="chip bg-coral text-white">🚀 Promoted</span>}
            {school.partner && <span className="chip bg-mint">✓ Verified by school</span>}
            <span className="chip bg-lavender">{school.kind === "school" ? "School with pre-primary" : "Preschool"}</span>
            {school.has_daycare && <span className="chip bg-sun">Daycare</span>}
          </div>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">{school.name}</h1>
          <p className="mt-2 text-muted">📍 {school.locality}, Gurugram</p>
          {google.rating && <p className="mt-2 flex items-center gap-2 text-sm"><Stars value={google.rating} /><b>{google.rating.toFixed(1)}</b>{google.count ? <span className="text-muted">({google.count.toLocaleString("en-IN")} Google reviews)</span> : null}</p>}
          {d.tagline && <p className="mt-3 text-lg leading-7 text-ink/80">{d.tagline}</p>}
          <div className="mt-6">
            <Tabs tabs={[
              { id: "overview", label: "Overview", content: overview },
              { id: "fees", label: "Fees", content: fees },
              { id: "admission", label: "Admission", content: admission },
              { id: "reviews", label: "Reviews", content: reviewsTab },
              { id: "location", label: "Location", content: location },
            ]} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card border-coral/30 p-5">
            <p className="font-display text-xl font-semibold">Interested in this school?</p>
            <p className="mt-1 text-sm leading-6 text-muted">Share your details once and the admissions team will contact you with fees, timings and visit slots.</p>
            <div className="mt-4 space-y-2">
              {lead()}
              <a href={googleMapsUrl(school)} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">🗺️ View on Google Maps</a>
              <a href={googleReviewsUrl} target="_blank" rel="noreferrer" className="btn btn-ghost w-full">⭐ Google reviews</a>
              <div className="[&>button]:w-full"><CompareToggle slug={school.slug} /></div>
            </div>
            <p className="mt-3 text-center text-xs text-muted">Free for parents. Your details go only to this school.</p>
          </div>
          <div className="mt-4"><Tip emoji="📋" title="Visiting soon?">Take the <Link href="/guide#visit" className="font-semibold text-coral hover:underline">visit checklist</Link> with you.</Tip></div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">{lead("📞 Get contact details", "btn btn-primary w-full !min-h-12")}</div>
      <div className="h-16 lg:hidden" />
      <p className="mt-10 text-xs text-muted">Information on this page comes from the school's own published material. Details can change, so please confirm with the school. Is something wrong? <Link href="/for-schools" className="underline">Schools can claim and update this page.</Link></p>
    </div>
  );
}
