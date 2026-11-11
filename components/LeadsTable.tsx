import { updateLeadStatus, setLeadUnlocked } from "@/lib/actions";
import { LEAD_STATUSES, type Lead } from "@/lib/types";

const fmt = (d: Date) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const mask = (s: string) => s.replace(/\S/g, (c, i) => (i < 2 ? c : "•"));

export default function LeadsTable({ leads, admin = false }: { leads: Lead[]; admin?: boolean }) {
  if (!leads.length) return <p className="rounded-2xl bg-bg p-6 text-center text-sm text-muted">No enquiries yet. They will appear here as soon as a parent shares their interest.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[52rem] text-left text-sm">
        <thead className="bg-bg text-xs uppercase tracking-wide text-muted">
          <tr><th className="p-3">Date</th>{admin && <th className="p-3">School</th>}<th className="p-3">Parent</th><th className="p-3">Contact</th><th className="p-3">Child / interest</th><th className="p-3">Message</th><th className="p-3">Status</th>{admin && <th className="p-3">Access</th>}</tr>
        </thead>
        <tbody>
          {leads.map((l) => {
            const open = admin || l.unlocked;
            return (
              <tr key={l.id} className="border-t border-line align-top">
                <td className="whitespace-nowrap p-3 text-muted">{fmt(l.created_at)}</td>
                {admin && <td className="p-3">{l.school_name}</td>}
                <td className="p-3 font-semibold">{open ? l.parent_name : mask(l.parent_name)}</td>
                <td className="p-3">{open ? (<><a href={`tel:${l.phone.replace(/\s/g, "")}`} className="font-semibold text-coral">{l.phone}</a>{l.email && <div className="text-muted">{l.email}</div>}</>) : <span className="chip bg-sun">🔒 Locked</span>}</td>
                <td className="p-3">{[l.child_age, l.program, l.start_month].filter(Boolean).join(" · ") || "-"}</td>
                <td className="max-w-56 p-3 text-muted">{open ? l.message || "-" : "-"}</td>
                <td className="p-3">
                  {open ? (
                    <form action={updateLeadStatus} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={l.id} />
                      <select name="status" defaultValue={l.status} aria-label="Status" className="rounded-full border border-line bg-white px-2 py-1.5 text-sm capitalize">{LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                      <button className="rounded-full bg-ink px-2.5 py-1.5 text-xs font-semibold text-white">Save</button>
                    </form>
                  ) : <span className="capitalize text-muted">{l.status}</span>}
                </td>
                {admin && (
                  <td className="p-3">
                    <form action={setLeadUnlocked}>
                      <input type="hidden" name="id" value={l.id} /><input type="hidden" name="unlocked" value={l.unlocked ? "0" : "1"} />
                      <button className={`chip ${l.unlocked ? "bg-mint" : "bg-coral text-white"}`}>{l.unlocked ? "✓ Shared with school" : "Share with school"}</button>
                    </form>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
