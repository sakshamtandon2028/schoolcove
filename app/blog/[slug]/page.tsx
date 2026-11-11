import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { POSTS, postBySlug } from "@/lib/blog";

export const dynamicParams = false;
export function generateStaticParams() { return POSTS.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = postBySlug((await params).slug);
  if (!p) return {};
  return {
    title: p.title, description: p.description, alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.description, publishedTime: p.date },
  };
}

const id = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();
  const related = POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).concat(POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category)).slice(0, 3);
  const heads = post.blocks.filter((b) => b.h).map((b) => b.h!);
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description, datePublished: post.date, dateModified: post.date,
      author: { "@type": "Organization", name: "SchoolCove" }, publisher: { "@type": "Organization", name: "SchoolCove" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" }, { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" }, { "@type": "ListItem", position: 3, name: post.title } ] },
  ];
  return (
    <div className="container-x pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="text-sm text-muted" aria-label="Breadcrumb"><Link href="/" className="hover:text-coral">Home</Link> / <Link href="/blog" className="hover:text-coral">Blog</Link></nav>
      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[14rem_minmax(0,46rem)_22rem] xl:justify-between">
        <aside className="hidden xl:block">
          <div className="sticky top-24 text-sm">
            <p className="font-bold">On this page</p>
            <ul className="mt-3 space-y-2 border-l border-line pl-4 text-muted">{heads.map((h) => <li key={h}><a href={`#${id(h)}`} className="hover:text-coral">{h}</a></li>)}</ul>
          </div>
        </aside>

        <article className="min-w-0">
          <p className="eyebrow">{post.category}</p>
          <h1 className="mt-2 text-3xl leading-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-3 text-sm text-muted">By the SchoolCove team · {post.minutes} min read · Updated {new Date(post.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
          <p className="mt-6 text-lg leading-8 text-ink/85">{post.intro}</p>
          {post.blocks.map((b, i) => (
            <section key={i} className="mt-8">
              {b.h && <h2 id={id(b.h)} className="scroll-mt-24 text-2xl sm:text-3xl">{b.h}</h2>}
              {b.p?.map((t) => <p key={t} className="mt-3 text-[1.05rem] leading-8 text-ink/85">{t}</p>)}
              {b.list && <ul className="mt-3 space-y-2.5">{b.list.map((t) => <li key={t} className="flex gap-3 text-[1.05rem] leading-7 text-ink/85"><span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-coral" aria-hidden="true" />{t}</li>)}</ul>}
            </section>
          ))}
          <section className="mt-10 rounded-3xl bg-mint/60 p-6">
            <h2 className="text-xl">In short</h2>
            <ul className="mt-3 space-y-2">{post.takeaways.map((t) => <li key={t} className="flex gap-2.5 leading-7"><span aria-hidden="true">✓</span>{t}</li>)}</ul>
          </section>
          <p className="mt-6 text-sm leading-6 text-muted">School details mentioned here come from each school's own published information and can change. Please confirm with the school before you decide.</p>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="card border-coral/30 p-5">
            <p className="font-display text-xl">Looking for a preschool in Gurugram?</p>
            <p className="mt-1 text-sm leading-6 text-muted">Compare programmes, timings and fees, then ask the school to call you back. Free for parents.</p>
            <Link href={post.cta?.href || "/schools"} className="btn btn-primary mt-4 w-full">{post.cta?.label || "Browse schools"} <span className="nudge" aria-hidden="true">→</span></Link>
          </div>
          <div className="card p-5">
            <p className="font-bold">Keep reading</p>
            <ul className="mt-3 space-y-3 text-sm">{related.map((r) => <li key={r.slug}><Link href={`/blog/${r.slug}`} className="font-semibold leading-6 hover:text-coral">{r.title}</Link></li>)}</ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
