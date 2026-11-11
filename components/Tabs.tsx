"use client";
import { useEffect, useState } from "react";

export default function Tabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (tabs.some((t) => t.id === h)) setActive(h);
  }, [tabs]);
  const pick = (id: string) => { setActive(id); history.replaceState(null, "", `#${id}`); };
  return (
    <div>
      <div role="tablist" className="sticky top-16 z-20 -mx-4 flex gap-1 overflow-x-auto border-b border-line bg-bg/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-full sm:border sm:px-2">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={active === t.id} onClick={() => pick(t.id)}
            className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${active === t.id ? "bg-coral text-white" : "text-ink hover:bg-blush"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id} className="pt-6">{t.content}</div>
      ))}
    </div>
  );
}
