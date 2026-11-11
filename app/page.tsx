import Link from "next/link";
import { allSchools } from "@/lib/schools";
import { POSTS } from "@/lib/blog";
import SchoolCard from "@/components/SchoolCard";
import { Tip, SchoolImage } from "@/components/bits";
import LeadForm from "@/components/LeadForm";
import { ageLabel } from "@/lib/schools";

export const revalidate = 600;
export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const schools = await allSchools();
  const choice = schools.find((s) => s.choice);
  const featured = schools.filter((s) => !s.choice).slice(0, 6);
  const localities = [...new Set(schools.map((s) => s.locality))];
  const withPhotos = schools.filter((s) => s.data.images.length > 1);
  const heroShots = [withPhotos[1] && { s: withPhotos[1], i: 2 }, withPhotos[1] && { s: withPhotos[1], i: 1 }, withPhotos[2] && { s: withPhotos[2], i: 0 }].filter(Boolean) as { s: (typeof schools)[number]; i: number }[];
  return (
    <>
      <section className="container-x grid items-center gap-8 pb-10 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-bold"><span className="size-2 rounded-full bg-emerald-500" /> {schools.length} schools listed in Gurugram</p>
          <h1 className="mt-4 text-[2.6rem] leading-[1.04] sm:text-6xl xl:text-7xl">The right preschool is closer than you think.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg xl:text-xl xl:leading-8">Compare preschools and daycares near you. See programmes, timings, fees and directions, then ask the school to call you back. Free for parents.</p>
          <form action="/schools" className="mt-6 flex max-w-xl items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-5 shadow-lg transition-shadow duration-300 focus-within:border-coral/50 focus-within:shadow-xl">
            <span aria-hidden="true">🔍</span>
            <input name="q" aria-label="Search schools" placeholder="Search by area or school name" className="min-h-11 w-full bg-transparent text-base outline-none" />
            <button className="btn btn-primary shrink-0">Search</button>
          </form>
          <div className="mt-4 flex max-w-xl flex-wrap gap-2">
            {localities.slice(0, 5).map((l) => <Link key={l} href={`/schools?q=${encodeURIComponent(l)}`} className="chip border border-line bg-white hover:bg-blush">{l}</Link>)}
            <Link href="/schools?daycare=1" className="chip bg-mint">With daycare</Link>
          </div>
        </div>
        <div className="grid grid-cols-5 grid-rows-2 gap-3 sm:gap-4" aria-hidden="true">
          {heroShots[0] && <div className="col-span-3 row-span-2"><SchoolImage school={heroShots[0].s} index={heroShots[0].i} priority sizes="(min-width: 1024px) 30vw, 60vw" className="h-56 w-full rounded-[2rem] sm:h-96 lg:h-[30rem]" /></div>}
          {heroShots[1] && <div className="col-span-2"><SchoolImage school={heroShots[1].s} index={heroShots[1].i} sizes="(min-width: 1024px) 20vw, 40vw" className="size-full min-h-28 rounded-[1.5rem]" /></div>}
          {heroShots[2] && <div className="col-span-2"><SchoolImage school={heroShots[2].s} index={heroShots[2].i} sizes="(min-width: 1024px) 20vw, 40vw" className="size-full min-h-28 rounded-[1.5rem]" /></div>}
        </div>
      </section>

      <section className="container-x">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["🔍", "1. Search", "Browse schools by area, your child's age and whether you need daycare."],
            ["⚖️", "2. Compare", "Put up to three schools side by side. See what each one publishes and what to ask."],
            ["📞", "3. Get a call back", "Share your interest once. The school's admissions team contacts you directly."],
          ].map(([e, t, b]) => (
            <div key={t} data-reveal="" className="card card-lift hover-wiggle p-5"><p className="wig text-2xl" aria-hidden="true">{e}</p><p className="mt-2 font-bold">{t}</p><p className="mt-1 text-sm leading-6 text-muted">{b}</p></div>
          ))}
        </div>
      </section>


      {choice && (
        <section className="container-x mt-14" data-reveal="">
          <div className="card card-lift overflow-hidden border-2 !border-ink/80">
            <div className="choice-ribbon flex items-center justify-between gap-3 px-5 py-2.5 text-white">
              <p className="text-sm font-bold tracking-wide">🏅 SchoolCove's Choice</p>
              <p className="hidden text-xs text-white/80 sm:block">Our top pick in Gurugram right now</p>
            </div>
            <div className="grid lg:grid-cols-[1.1fr_1fr]">
              <Link href={`/schools/${choice.slug}`} className="relative block min-h-60 overflow-hidden lg:min-h-[26rem]">
                <SchoolImage school={choice} sizes="(min-width: 1024px) 50vw, 100vw" className="zoom !absolute inset-0 size-full" />
              </Link>
              <div className="p-6 sm:p-8">
                <p className="eyebrow">Top choice</p>
                <h2 className="mt-1 text-3xl leading-tight sm:text-4xl">{choice.name}</h2>
                <p className="mt-1 text-muted">📍 {choice.locality}, Gurugram</p>
                {choice.data.tagline && <p className="mt-3 leading-7 text-ink/85">{choice.data.tagline}</p>}
                <ul className="mt-4 space-y-2">
                  {choice.data.highlights.works.slice(0, 3).map((w) => (
                    <li key={w} className="flex gap-2.5 text-sm leading-6"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mint text-xs text-emerald-700" aria-hidden="true">✓</span>{w}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {choice.has_daycare && <span className="chip bg-mint">Daycare</span>}
                  {choice.min_age_months != null && <span className="chip bg-sun">From {ageLabel(choice.min_age_months)}</span>}
                  {choice.data.curriculum && <span className="chip bg-lavender">{choice.data.curriculum.split(",")[0]}</span>}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link href={`/schools/${choice.slug}`} className="btn btn-primary">See why we picked it <span className="nudge" aria-hidden="true">→</span></Link>
                  <LeadForm schoolId={choice.id} schoolName={`${choice.name}, ${choice.locality}`} programs={choice.data.programs.map((p) => p.name)} label="📞 Get a call back" className="btn btn-ghost" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="container-x mt-14">
        <div className="flex items-end justify-between gap-4" data-reveal="">
          <div><p className="eyebrow">Schools in Gurugram</p><h2 className="mt-1 text-3xl sm:text-4xl">More schools to explore</h2></div>
          <Link href="/schools" className="shrink-0 text-sm font-semibold text-coral hover:underline">See all {schools.length} <span className="nudge" aria-hidden="true">→</span></Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((s, i) => <div key={s.id} data-reveal="" style={{ ["--d" as string]: `${(i % 3) * 80}ms` }} className="flex [&>article]:w-full"><SchoolCard school={s} /></div>)}</div>
      </section>

      <section className="container-x mt-14">
        <div className="card p-6 sm:p-8" data-reveal="">
          <p className="eyebrow">Parent guide</p>
          <h2 className="mt-1 text-3xl">Before you choose, a few dos and don'ts</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Tip emoji="✅" title="Do visit during school hours" tone="bg-mint">You learn more from ten minutes of watching a real class than from any brochure.</Tip>
            <Tip emoji="🚫" title="Don't decide on the building alone" tone="bg-blush">A warm, steady teacher matters more to a two-year-old than a fancy lobby.</Tip>
            <Tip emoji="✅" title="Do ask for the full fee card" tone="bg-mint">Ask what is one-time, what is monthly and what is extra: meals, transport, activities.</Tip>
            <Tip emoji="🚫" title="Don't skip the commute test" tone="bg-blush">Drive the route at drop-off time once. Fifteen minutes on a map can be forty in traffic.</Tip>
          </div>
          <Link href="/guide" className="btn btn-ghost mt-5">Read the full guide →</Link>
        </div>
      </section>

      <section className="container-x mt-14">
        <div className="flex items-end justify-between gap-4" data-reveal="">
          <div><p className="eyebrow">From the blog</p><h2 className="mt-1 text-3xl sm:text-4xl">Guides parents are reading</h2></div>
          <Link href="/blog" className="shrink-0 text-sm font-semibold text-coral hover:underline">All articles <span className="nudge" aria-hidden="true">→</span></Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POSTS.slice(0, 4).map((p, i) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-lift flex flex-col p-5" data-reveal="" style={{ ["--d" as string]: `${i * 60}ms` }}>
              <span className="chip self-start bg-lavender">{p.category}</span>
              <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
              <p className="mt-auto pt-4 text-sm font-bold text-coral">Read <span className="nudge" aria-hidden="true">→</span> <span className="font-normal text-muted">· {p.minutes} min</span></p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x mt-14">
        <div className="rounded-3xl bg-ink p-7 text-white sm:p-10" data-reveal="">
          <p className="text-xs font-bold uppercase tracking-widest text-coral-soft">For schools</p>
          <h2 className="mt-2 text-3xl">Run a preschool or daycare in Gurugram?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">Claim your page, keep your details up to date and receive enquiries from parents who asked to hear from you.</p>
          <Link href="/for-schools" className="btn btn-primary mt-5">Claim your school</Link>
        </div>
      </section>
    </>
  );
}
