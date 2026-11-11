import Link from "next/link";
import { POSTS } from "@/lib/blog";

export const metadata = {
  title: "Blog: preschool admissions, fees and parenting tips for Gurugram parents",
  description: "Plain-language guides on choosing a preschool or daycare in Gurgaon: admission age, fees, visit checklists, safety, settling in and more.",
  alternates: { canonical: "/blog" },
};

const tone: Record<string, string> = { Admissions: "bg-lavender", Fees: "bg-sun", "Choosing a school": "bg-mint", Daycare: "bg-blush", Parenting: "bg-coral-soft", "Gurugram areas": "bg-lavender" };

export default function BlogIndex() {
  const [lead, ...rest] = POSTS;
  return (
    <div className="container-x pt-8">
      <p className="eyebrow">SchoolCove blog</p>
      <h1 className="mt-1 max-w-3xl text-4xl sm:text-5xl">Straight answers for parents choosing a preschool</h1>
      <p className="mt-3 max-w-2xl text-lg leading-7 text-muted">Admissions, fees, daycare and the first days of school, written for families in Gurugram.</p>

      <Link href={`/blog/${lead.slug}`} className="card card-lift mt-8 block p-6 sm:p-9" data-reveal="">
        <span className={`chip ${tone[lead.category]}`}>{lead.category}</span>
        <h2 className="mt-3 max-w-3xl text-2xl leading-tight sm:text-4xl">{lead.title}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted">{lead.description}</p>
        <p className="mt-4 text-sm font-bold text-coral">Read the guide <span className="nudge" aria-hidden="true">→</span> <span className="font-normal text-muted">· {lead.minutes} min read</span></p>
      </Link>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {rest.map((p, i) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-lift flex flex-col p-5" data-reveal="" style={{ ["--d" as string]: `${(i % 4) * 60}ms` }}>
            <span className={`chip self-start ${tone[p.category]}`}>{p.category}</span>
            <h2 className="mt-3 text-xl leading-snug">{p.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{p.description}</p>
            <p className="mt-auto pt-4 text-sm font-bold text-coral">Read <span className="nudge" aria-hidden="true">→</span> <span className="font-normal text-muted">· {p.minutes} min</span></p>
          </Link>
        ))}
      </div>
    </div>
  );
}
