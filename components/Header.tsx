import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`font-display ${className}`}>School<span className="text-coral">Cove</span></span>;
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-2">
        <Link href="/" aria-label="SchoolCove home"><Wordmark className="text-xl sm:text-2xl" /></Link>
        <nav className="flex shrink-0 items-center text-sm font-semibold sm:gap-2">
          <Link href="/schools" className="rounded-full px-2 py-2 hover:bg-blush sm:px-3">Schools</Link>
          <Link href="/guide" className="hidden rounded-full px-2 py-2 hover:bg-blush min-[370px]:block sm:px-3"><span className="sm:hidden">Guide</span><span className="hidden sm:inline">Parent guide</span></Link>
          <Link href="/compare" className="hidden rounded-full px-3 py-2 hover:bg-blush sm:block">Compare</Link>
          <Link href="/blog" className="hidden rounded-full px-3 py-2 hover:bg-blush md:block">Blog</Link>
          <Link href="/for-schools" className="btn btn-ghost ml-1 !min-h-10 !px-3 sm:!px-4">For schools</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <Wordmark className="text-2xl" />
          <p className="mt-2 text-sm text-muted">Helping parents in Gurugram choose preschools and daycares with confidence.</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">For parents</p>
          <ul className="mt-2 space-y-1.5 text-muted">
            <li><Link href="/schools" className="hover:text-coral">Browse schools</Link></li>
            <li><Link href="/compare" className="hover:text-coral">Compare schools</Link></li>
            <li><Link href="/guide" className="hover:text-coral">Parent guide: dos and don'ts</Link></li>
            <li><Link href="/blog" className="hover:text-coral">Blog: admissions, fees and tips</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">For schools</p>
          <ul className="mt-2 space-y-1.5 text-muted">
            <li><Link href="/for-schools" className="hover:text-coral">List or claim your school</Link></li>
            <li><Link href="/login" className="hover:text-coral">School login</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} SchoolCove. School details come from each school's own published information. Always confirm with the school before you decide.
      </div>
    </footer>
  );
}
