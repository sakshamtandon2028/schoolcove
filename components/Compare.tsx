"use client";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "sc_compare";
const listeners = new Set<() => void>();
let cache: string[] | null = null;
const read = (): string[] => {
  if (cache) return cache;
  try { const v = JSON.parse(localStorage.getItem(KEY) || "[]"); cache = Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; }
  catch { cache = []; }
  return cache!;
};
const write = (v: string[]) => { cache = v; try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const EMPTY: string[] = [];
export const useCompare = () => useSyncExternalStore(subscribe, read, () => EMPTY);

export function CompareToggle({ slug }: { slug: string }) {
  const list = useCompare();
  const on = list.includes(slug);
  const full = !on && list.length >= 3;
  return (
    <button type="button" aria-pressed={on} disabled={full}
      onClick={() => write(on ? list.filter((s) => s !== slug) : [...list, slug])}
      className={`btn ${on ? "bg-mint text-ink ring-1 ring-emerald-300" : "btn-ghost"}`}
      title={full ? "You can compare up to 3 schools" : undefined}>
      {on ? "✓ Added to compare" : full ? "Compare is full (3)" : "+ Compare"}
    </button>
  );
}

export function CompareBar() {
  const list = useCompare();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || list.length === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-20 z-30 flex justify-center px-4 lg:bottom-4">
      <div className="flex items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-4 shadow-xl">
        <span className="text-sm font-semibold">{list.length} selected</span>
        <button onClick={() => write([])} className="rounded-full px-2 text-sm text-muted hover:text-coral">Clear</button>
        <Link href={`/compare?s=${list.join(",")}`} className="btn btn-primary !min-h-10">⚖️ Compare</Link>
      </div>
    </div>
  );
}

export function CompareRedirect() {
  // On /compare with no schools in the URL, load the saved selection.
  const list = useCompare();
  useEffect(() => { if (list.length) window.location.replace(`/compare?s=${list.join(",")}`); }, [list]);
  return null;
}

export function RemoveFromCompare({ slug, all }: { slug: string; all: string[] }) {
  const rest = all.filter((s) => s !== slug);
  return (
    <Link href={rest.length ? `/compare?s=${rest.join(",")}` : "/compare?s="} onClick={() => write(read().filter((s) => s !== slug))}
      className="text-xs font-semibold text-muted hover:text-coral">✕ Remove</Link>
  );
}
