import Link from "next/link";
import { q } from "@/lib/db";
import { requireSchoolUser } from "@/lib/auth";
import { logout } from "@/lib/actions";
import { schoolByIdFresh as schoolById } from "@/lib/schools";
import type { Lead } from "@/lib/types";
import LeadsTable from "@/components/LeadsTable";
import { ProfileForm } from "@/components/AuthForms";

export const dynamic = "force-dynamic";
export const metadata = { title: "School dashboard" };

export default async function Dashboard() {
  const user = await requireSchoolUser();
  const school = user.school_id ? await schoolById(user.school_id) : null;
  const Logout = () => <form action={logout}><button className="btn btn-ghost !min-h-10">Log out</button></form>;

  if (user.status !== "approved" || !school) {
    return (
      <div className="container-x max-w-xl py-16 text-center">
        <p className="text-5xl" aria-hidden="true">{user.status === "rejected" ? "🚫" : "⏳"}</p>
        <h1 className="mt-4 text-3xl">{user.status === "rejected" ? "We could not verify this account" : "Your account is being verified"}</h1>
        <p className="mt-2 leading-7 text-muted">
          {user.status === "rejected"
            ? "Please write to us if you think this is a mistake."
            : `Thanks, ${user.name}. We are confirming that you represent ${user.school_name || "your school"}. This usually takes less than a day. You will be able to see enquiries here once it is done.`}
        </p>
        <div className="mt-6 flex justify-center"><Logout /></div>
      </div>
    );
  }

  const leads = await q<Lead>(`select * from leads where school_id=$1 order by created_at desc`, [school.id]);
  const unlocked = leads.filter((l) => l.unlocked);
  const thisMonth = leads.filter((l) => new Date(l.created_at) > new Date(Date.now() - 30 * 864e5)).length;
  const admitted = leads.filter((l) => l.status === "admitted").length;
  const price = Number(process.env.LEAD_PRICE || 500);
  const stats: [string, string | number, string][] = [
    ["Page views", school.views, "👀"], ["Total enquiries", leads.length, "📥"], ["Last 30 days", thisMonth, "📅"], ["Admitted", admitted, "🎓"],
  ];

  return (
    <div className="container-x pt-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="eyebrow">School dashboard</p><h1 className="mt-1 text-3xl sm:text-4xl">{school.name}</h1><p className="text-muted">{school.locality} · Logged in as {user.name}</p></div>
        <div className="flex gap-2"><Link href={`/schools/${school.slug}`} className="btn btn-ghost !min-h-10">View public page</Link><Logout /></div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([k, v, e]) => <div key={k} className="card p-4"><p className="text-sm text-muted"><span aria-hidden="true">{e}</span> {k}</p><p className="mt-1 font-display text-3xl font-semibold">{v}</p></div>)}
      </div>

      <section className="card mt-6 p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-2xl">Parent enquiries</h2><p className="text-sm text-muted">Call new enquiries within a day. Update the status so you can track what happened.</p></div>
          <a href="/api/export" className="btn btn-primary">⬇️ Download Excel</a>
        </div>
        {leads.length > unlocked.length && (
          <p className="mb-4 rounded-2xl bg-sun p-3 text-sm leading-6">🔒 {leads.length - unlocked.length} {leads.length - unlocked.length === 1 ? "enquiry is" : "enquiries are"} waiting to be shared with you. Enquiries are charged at ₹{price.toLocaleString("en-IN")} each. Contact SchoolCove to unlock them.</p>
        )}
        <LeadsTable leads={leads} />
      </section>

      <section className="card mt-6 p-5 sm:p-6">
        <h2 className="text-2xl">Your school page</h2>
        <p className="mb-5 text-sm text-muted">Parents trust pages that are complete and current. Changes go live as soon as you save.</p>
        <ProfileForm school={school} />
      </section>
    </div>
  );
}
