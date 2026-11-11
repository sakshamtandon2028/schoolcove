import Link from "next/link";
import { q } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logout, setUserStatus, setReviewStatus, setSchoolFlag } from "@/lib/actions";
import { allSchools } from "@/lib/schools";
import type { Lead, Review, User } from "@/lib/types";
import LeadsTable from "@/components/LeadsTable";
import { ProfileForm } from "@/components/AuthForms";
import { Stars } from "@/components/bits";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function Admin({ searchParams }: { searchParams: Promise<{ edit?: string; school?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const [schools, users, reviews] = await Promise.all([
    allSchools(),
    q<User>(`select u.*, s.name || ', ' || s.locality as school_name from users u left join schools s on s.id=u.school_id where u.role='school' order by (u.status='pending') desc, u.created_at desc`),
    q<Review>(`select r.*, s.name || ', ' || s.locality as school_name from reviews r join schools s on s.id=r.school_id order by (r.status='pending') desc, r.created_at desc`),
  ]);
  const filterId = Number(sp.school) || null;
  const leads = await q<Lead>(
    `select l.*, s.name || ', ' || s.locality as school_name from leads l join schools s on s.id=l.school_id ${filterId ? "where l.school_id=$1" : ""} order by l.created_at desc`,
    filterId ? [filterId] : []);
  const counts = await q<{ school_id: number; n: number; shared: number }>(`select school_id, count(*)::int n, count(*) filter (where unlocked)::int shared from leads group by school_id`);
  const countFor = (id: number) => counts.find((c) => c.school_id === id) || { n: 0, shared: 0 };
  const editing = sp.edit ? schools.find((s) => s.slug === sp.edit) : null;
  const price = Number(process.env.LEAD_PRICE || 500);
  const totalLeads = counts.reduce((a, c) => a + c.n, 0), shared = counts.reduce((a, c) => a + c.shared, 0);
  const pendingUsers = users.filter((u) => u.status === "pending").length, pendingReviews = reviews.filter((r) => r.status === "pending").length;
  const fmt = (d: Date) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const Flag = ({ id, flag, on, label }: { id: number; flag: string; on: boolean; label: string }) => (
    <form action={setSchoolFlag}><input type="hidden" name="id" value={id} /><input type="hidden" name="flag" value={flag} /><input type="hidden" name="value" value={on ? "0" : "1"} />
      <button className={`chip ${on ? "bg-mint" : "border border-line bg-white text-muted"}`} aria-pressed={on}>{on ? "✓ " : ""}{label}</button></form>
  );

  return (
    <div className="container-x pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="eyebrow">SchoolCove admin</p><h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Control room</h1></div>
        <div className="flex gap-2"><a href="/api/export" className="btn btn-primary">⬇️ All enquiries (Excel)</a><form action={logout}><button className="btn btn-ghost">Log out</button></form></div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {([["Schools", schools.length], ["Enquiries", totalLeads], ["Shared with schools", shared], ["Billable value", `₹${(shared * price).toLocaleString("en-IN")}`], ["Waiting for you", pendingUsers + pendingReviews]] as [string, string | number][]).map(([k, v]) => (
          <div key={k} className="card p-4"><p className="text-sm text-muted">{k}</p><p className="mt-1 font-display text-3xl font-semibold">{v}</p></div>
        ))}
      </div>

      <section className="card mt-6 p-5 sm:p-6">
        <h2 className="text-2xl font-semibold">School accounts {pendingUsers > 0 && <span className="chip ml-2 bg-coral text-white">{pendingUsers} to verify</span>}</h2>
        <p className="mb-4 text-sm text-muted">Approve an account only after confirming the person works at the school.</p>
        {users.length ? (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-bg text-xs uppercase tracking-wide text-muted"><tr><th className="p-3">Person</th><th className="p-3">School</th><th className="p-3">Contact</th><th className="p-3">Joined</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>{users.map((u) => (
                <tr key={u.id} className="border-t border-line">
                  <td className="p-3"><b>{u.name}</b>{u.designation && <div className="text-muted">{u.designation}</div>}</td>
                  <td className="p-3">{u.school_name}</td>
                  <td className="p-3">{u.email}{u.phone && <div className="text-muted">{u.phone}</div>}</td>
                  <td className="p-3 text-muted">{fmt(u.created_at)}</td>
                  <td className="p-3"><span className={`chip capitalize ${u.status === "approved" ? "bg-mint" : u.status === "pending" ? "bg-sun" : "bg-blush"}`}>{u.status}</span></td>
                  <td className="p-3"><div className="flex gap-1.5">
                    {u.status !== "approved" && <form action={setUserStatus}><input type="hidden" name="id" value={u.id} /><input type="hidden" name="status" value="approved" /><button className="chip bg-ink text-white">Approve</button></form>}
                    {u.status !== "rejected" && <form action={setUserStatus}><input type="hidden" name="id" value={u.id} /><input type="hidden" name="status" value="rejected" /><button className="chip border border-line bg-white">Reject</button></form>}
                  </div></td>
                </tr>))}</tbody>
            </table>
          </div>
        ) : <p className="rounded-2xl bg-bg p-6 text-center text-sm text-muted">No school has signed up yet.</p>}
      </section>

      <section className="card mt-6 p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-2xl font-semibold">Parent enquiries</h2><p className="text-sm text-muted">"Share with school" makes the parent's details visible in that school's dashboard and counts it as billable.</p></div>
          <form className="flex items-center gap-2">
            <select name="school" defaultValue={filterId || ""} aria-label="Filter by school" className="input !min-h-10 !w-64 !py-1.5 text-sm"><option value="">All schools</option>{schools.map((s) => <option key={s.id} value={s.id}>{s.name}, {s.locality}</option>)}</select>
            <button className="btn btn-ghost !min-h-10">Filter</button>
            {filterId && <a href={`/api/export?school=${filterId}`} className="btn btn-ghost !min-h-10">⬇️ Excel</a>}
          </form>
        </div>
        <LeadsTable leads={leads} admin />
      </section>

      <section className="card mt-6 p-5 sm:p-6">
        <h2 className="text-2xl font-semibold">Schools</h2>
        <p className="mb-4 text-sm text-muted"><b>Promoted</b> lists the school first. <b>Verified</b> shows the "Verified by school" badge. <b>Auto-share</b> sends new enquiries to the school straight away, for schools that have prepaid.</p>
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="bg-bg text-xs uppercase tracking-wide text-muted"><tr><th className="p-3">School</th><th className="p-3">Views</th><th className="p-3">Enquiries</th><th className="p-3">Settings</th><th className="p-3" /></tr></thead>
            <tbody>{schools.map((s) => (
              <tr key={s.id} className="border-t border-line">
                <td className="p-3"><Link href={`/schools/${s.slug}`} className="font-semibold hover:text-coral">{s.name}</Link><div className="text-muted">{s.locality}</div></td>
                <td className="p-3">{s.views}</td>
                <td className="p-3">{countFor(s.id).n} <span className="text-muted">({countFor(s.id).shared} shared)</span></td>
                <td className="p-3"><div className="flex flex-wrap gap-1.5"><Flag id={s.id} flag="promoted" on={s.promoted} label="Promoted" /><Flag id={s.id} flag="partner" on={s.partner} label="Verified" /><Flag id={s.id} flag="auto_unlock" on={s.auto_unlock} label="Auto-share" /></div></td>
                <td className="p-3"><Link href={`/admin?edit=${s.slug}#edit`} className="font-semibold text-coral hover:underline">Edit page</Link></td>
              </tr>))}</tbody>
          </table>
        </div>
        {editing && (
          <div id="edit" className="mt-6 scroll-mt-24 rounded-2xl border border-coral/40 p-5">
            <div className="mb-4 flex items-center justify-between"><h3 className="font-display text-xl font-semibold">Editing: {editing.name}, {editing.locality}</h3><Link href="/admin" className="text-sm font-semibold text-muted hover:text-coral">Close</Link></div>
            <ProfileForm school={editing} />
          </div>
        )}
      </section>

      <section className="card mt-6 p-5 sm:p-6">
        <h2 className="text-2xl font-semibold">Parent reviews {pendingReviews > 0 && <span className="chip ml-2 bg-coral text-white">{pendingReviews} to check</span>}</h2>
        <p className="mb-4 text-sm text-muted">Reviews appear on the school page only after you approve them.</p>
        {reviews.length ? (
          <div className="space-y-3">{reviews.map((r) => (
            <div key={r.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-line p-4">
              <div className="max-w-2xl"><p className="text-sm"><Stars value={r.rating} /> <b>{r.name}</b> on <b>{r.school_name}</b> <span className="text-muted">· {fmt(r.created_at)}</span></p><p className="mt-1 text-sm leading-6">{r.body}</p></div>
              <div className="flex gap-1.5">
                <form action={setReviewStatus}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={r.status === "approved" ? "pending" : "approved"} /><button className={`chip ${r.status === "approved" ? "bg-mint" : "bg-ink text-white"}`}>{r.status === "approved" ? "✓ Live (hide)" : "Approve"}</button></form>
                <form action={setReviewStatus}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value="delete" /><button className="chip border border-line bg-white">Delete</button></form>
              </div>
            </div>))}</div>
        ) : <p className="rounded-2xl bg-bg p-6 text-center text-sm text-muted">No reviews submitted yet.</p>}
      </section>
    </div>
  );
}
