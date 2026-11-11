import Image from "next/image";
import type { School } from "@/lib/types";

export function Stars({ value, size = "text-base" }: { value: number; size?: string }) {
  const full = Math.round(value);
  return (
    <span className={`${size} tracking-tight`} aria-label={`${value} out of 5 stars`}>
      <span className="text-amber-400">{"★".repeat(full)}</span><span className="text-line">{"★".repeat(5 - full)}</span>
    </span>
  );
}

const tones = ["bg-mint", "bg-lavender", "bg-blush", "bg-sun"];

export function SchoolImage({ school, className = "", index = 0, sizes = "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw", priority = false }:
  { school: Pick<School, "id" | "name" | "data">; className?: string; index?: number; sizes?: string; priority?: boolean }) {
  const src = school.data.images?.[index];
  if (src?.startsWith("/")) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={`${school.name} campus`} fill sizes={sizes} priority={priority} quality={62} className="object-cover" />
      </div>
    );
  }
  if (src) return <img src={src} alt={`${school.name} campus`} loading={priority ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer" className={`object-cover ${className}`} />;
  return (
    <div className={`flex items-center justify-center ${tones[school.id % tones.length]} ${className}`} aria-hidden="true">
      <span className="text-5xl">🏫</span>
    </div>
  );
}

export function Tip({ emoji, title, children, tone = "bg-sun" }: { emoji: string; title: string; children: React.ReactNode; tone?: string }) {
  return (
    <div className={`rounded-2xl ${tone} p-4`}>
      <p className="text-sm font-bold"><span aria-hidden="true">{emoji}</span> {title}</p>
      <div className="mt-1 text-sm leading-6 text-ink/80">{children}</div>
    </div>
  );
}
