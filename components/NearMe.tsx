"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function NearMe() {
  const router = useRouter();
  const sp = useSearchParams();
  const [msg, setMsg] = useState("");
  const active = sp.get("sort") === "near";
  const go = () => {
    if (active) { const p = new URLSearchParams(sp); p.delete("sort"); p.delete("lat"); p.delete("lng"); router.push(`/schools?${p}`); return; }
    if (!navigator.geolocation) { setMsg("Location is not available on this device."); return; }
    setMsg("Finding your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => { const p = new URLSearchParams(sp); p.set("sort", "near"); p.set("lat", pos.coords.latitude.toFixed(4)); p.set("lng", pos.coords.longitude.toFixed(4)); setMsg(""); router.push(`/schools?${p}`); },
      () => setMsg("We could not get your location. Please allow location access and try again."),
      { timeout: 10000 });
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={go} aria-pressed={active} className={`btn ${active ? "btn-primary" : "btn-ghost"}`}>📍 {active ? "Sorted by distance" : "Near me"}</button>
      {msg && <span className="text-sm text-muted" role="status">{msg}</span>}
    </div>
  );
}
