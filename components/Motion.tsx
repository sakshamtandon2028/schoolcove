"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Fades sections in as they scroll into view. Any element with a data-reveal attribute takes part.
export default function Motion() {
  const path = usePathname();
  const sp = useSearchParams();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)"));
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path, sp]);
  return null;
}
