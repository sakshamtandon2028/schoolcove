"use client";
import { useEffect } from "react";

export default function ViewBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const t = setTimeout(() => { fetch("/api/view", { method: "POST", body: slug, keepalive: true }).catch(() => {}); }, 1500);
    return () => clearTimeout(t);
  }, [slug]);
  return null;
}
