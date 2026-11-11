import Link from "next/link";
import { allSchools, ageLabel, rupees } from "@/lib/schools";
import { SchoolImage, Stars } from "@/components/bits";
import { CompareRedirect, RemoveFromCompare } from "@/components/Compare";
import LeadForm from "@/components/LeadForm";

export const metadata = { title: "Compare schools" };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const sp = await searchParams;
  const slugs = (sp.s || "").split(",").filter(Boolean).slice(0, 3);
  const all = await allSchools();
  const picked = slugs.map((s) => all.find((x) => x.slug === s)).filter((x) => !!x);

  if (!picked.length) {
    return (
      <div className="container-x py-16 text-center">
        {sp.s === undefined && <CompareRedirect />}
        <p className="text-5xl" aria-hidden="true">⚖️</p>
        <h1 className="mt-4 text-4xl">Compare schools side by side</h1>
        <p className="mx-auto mt-2 max-w-md text-muted">Tap "+ Compare" on up to three schools, then come back here to see them next to each other.</p>
        <Link href="/schools" className="btn btn-primary mt-6">Browse schools</Link>
      </div>
    );
  }

  const rows: [string, (s: (typeof picked)[number]) => React.ReactNode][] = [
    ["Area", (s) => s.locality],
    ["Type", (s) => (s.kind === "school" ? "School with pre-primary" : "Preschool")],
    ["Google rating", (s) => (s.data.google?.rating ? <span className="flex items-center gap-1"><Stars value={s.data.google.rating} /> {s.data.google.rating}</span> : null)],
    ["Curriculum", (s) => s.data.curriculum],
    ["Youngest age", (s) => ageLabel(s.min_age_months)],
    ["Classes", (s) => s.data.grades || s.data.programs.map((p) => p.name).join(", ")],
    ["Daycare", (s) => (s.has_daycare ? `Yes${s.data.daycare?.hours ? `, ${s.data.daycare.hours}` : ""}` : "Not listed")],
    ["Timings", (s) => s.data.hours],
    ["Monthly fee from", (s) => (s.fee_from != null ? rupees(s.fee_from) : null)],
    ["Meals", (s) => s.data.meals],
    ["Transport", (s) => s.data.transport],
    ["Safety", (s) => s.data.safety?.join(", ")],
    ["Facilities", (s) => s.data.facilities.slice(0, 8).join(", ")],
    ["What to ask", (s) => s.data.highlights.ask[0]],
  ];
  const shown = rows.filter(([, f]) => picked.some((s) => f(s)));

  return (
    <div className="container-x pt-8">
      <p className="eyebrow">Side by side</p>
      <h1 className="mt-1 text-4xl sm:text-5xl">Compare your shortlist</h1>
      <p className="mt-2 text-muted">"Ask the school" means the school has not published that detail.</p>
      <div className="mt-6 overflow-x-auto pb-2">
        <table className="w-full min-w-[40rem] border-separate border-spacing-x-3 text-sm">
          <thead>
            <tr>
              <th className="w-32" />
              {picked.map((s) => (
                <th key={s.id} className="rounded-t-3xl border border-b-0 border-line bg-white p-4 text-left align-top font-normal">
                  <SchoolImage school={s} className="h-28 w-full rounded-2xl" />
                  <Link href={`/schools/${s.slug}`} className="mt-3 block font-display text-lg font-semibold leading-snug hover:text-coral">{s.name}</Link>
                  <div className="mt-1"><RemoveFromCompare slug={s.slug} all={picked.map((p) => p.slug)} /></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(([label, f]) => (
              <tr key={label}>
                <th scope="row" className="py-3 pr-2 text-left align-top text-xs font-bold uppercase tracking-wide text-muted">{label}</th>
                {picked.map((s) => <td key={s.id} className="border-x border-t border-line bg-white px-4 py-3 align-top leading-6">{f(s) || <span className="text-muted">Ask the school</span>}</td>)}
              </tr>
            ))}
            <tr>
              <th />
              {picked.map((s) => (
                <td key={s.id} className="rounded-b-3xl border border-line bg-white p-4">
                  <LeadForm schoolId={s.id} schoolName={`${s.name}, ${s.locality}`} programs={s.data.programs.map((p) => p.name)} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {picked.length < 3 && <Link href="/schools" className="btn btn-ghost mt-6">+ Add another school</Link>}
    </div>
  );
}
