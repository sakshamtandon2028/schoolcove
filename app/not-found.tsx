import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="text-5xl" aria-hidden="true">🔍</p>
      <h1 className="mt-4 text-4xl">We could not find that page</h1>
      <p className="mt-2 text-muted">The link may be old, or the school may have moved.</p>
      <Link href="/schools" className="btn btn-primary mt-6">Browse all schools</Link>
    </div>
  );
}
