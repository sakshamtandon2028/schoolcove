"use client";
import { useForm } from "./useForm";
import { login, signup, updateProfile } from "@/lib/actions";
import type { School } from "@/lib/types";

const Err = ({ msg }: { msg?: string }) => (msg ? <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-medium">{msg}</p> : null);

export function LoginForm() {
  const { state, onSubmit, pending } = useForm(login);
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div><label className="label" htmlFor="li-email">Email</label><input id="li-email" name="email" type="email" required autoComplete="email" className="input" /></div>
      <div><label className="label" htmlFor="li-pw">Password</label><input id="li-pw" name="password" type="password" required autoComplete="current-password" className="input" /></div>
      <Err msg={state?.error} />
      <button disabled={pending} className="btn btn-primary w-full !min-h-12">{pending ? "Logging in..." : "Log in"}</button>
    </form>
  );
}

export function SignupForm({ schools, preselect }: { schools: { id: number; label: string }[]; preselect?: number }) {
  const { state, onSubmit, pending } = useForm(signup);
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div><label className="label" htmlFor="su-school">Your school</label>
        <select id="su-school" name="school_id" required defaultValue={preselect || ""} className="input">
          <option value="" disabled>Select your school</option>
          {schools.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <p className="mt-1 text-xs text-muted">School not listed? Email us and we will add it.</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label" htmlFor="su-name">Your name</label><input id="su-name" name="name" required maxLength={100} autoComplete="name" className="input" /></div>
        <div><label className="label" htmlFor="su-role">Your role</label><input id="su-role" name="designation" maxLength={80} className="input" placeholder="For example: Centre Head" /></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label" htmlFor="su-email">Work email</label><input id="su-email" name="email" type="email" required autoComplete="email" className="input" /></div>
        <div><label className="label" htmlFor="su-phone">Phone</label><input id="su-phone" name="phone" type="tel" maxLength={20} autoComplete="tel" className="input" /></div>
      </div>
      <div><label className="label" htmlFor="su-pw">Create a password</label><input id="su-pw" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" placeholder="At least 8 characters" /></div>
      <Err msg={state?.error} />
      <button disabled={pending} className="btn btn-primary w-full !min-h-12">{pending ? "Creating account..." : "Create school account"}</button>
      <p className="text-center text-xs text-muted">We verify every account before giving access to a school's enquiries.</p>
    </form>
  );
}

export function ProfileForm({ school }: { school: School }) {
  const { state, onSubmit, pending } = useForm(updateProfile);
  const d = school.data;
  const F = ({ name, label, value, rows, hint }: { name: string; label: string; value?: string; rows?: number; hint?: string }) => (
    <div>
      <label className="label" htmlFor={`pf-${name}`}>{label}</label>
      {rows ? <textarea id={`pf-${name}`} name={name} rows={rows} defaultValue={value || ""} className="input" /> : <input id={`pf-${name}`} name={name} defaultValue={value || ""} className="input" />}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="school_id" value={school.id} />
      <F name="tagline" label="One-line summary" value={d.tagline} />
      <F name="about" label="About the school" value={d.about} rows={5} />
      <div className="grid gap-4 sm:grid-cols-2">
        <F name="curriculum" label="Curriculum / approach" value={d.curriculum} />
        <F name="hours" label="Timings" value={d.hours} />
        <F name="ratio" label="Staff to child ratio" value={d.ratio} />
        <F name="admission_status" label="Admission status" value={d.admission?.status} hint="For example: Admissions open for 2027-28" />
      </div>
      <F name="facilities" label="Facilities" value={d.facilities.join("\n")} rows={5} hint="One per line." />
      <div className="grid gap-4 sm:grid-cols-2">
        <F name="meals" label="Meals" value={d.meals} rows={2} />
        <F name="transport" label="Transport" value={d.transport} rows={2} />
      </div>
      <F name="fees" label="Fees" value={(d.fees?.items || []).map((i) => `${i.label}: ${i.amount}`).join("\n")} rows={5} hint="One per line, as  Label: Amount.  For example  Nursery: ₹12,000 / month. Leave empty to hide fees." />
      <div className="grid gap-4 sm:grid-cols-2">
        <F name="fee_from" label="Lowest monthly fee (number only)" value={school.fee_from != null ? String(school.fee_from) : ""} hint="Shown on your card as 'From ₹… / month'." />
        <F name="fees_note" label="Fee note" value={d.fees?.note} />
      </div>
      <F name="images" label="Photos" value={d.images.join("\n")} rows={4} hint="One image link per line (https://...). The first photo is your cover." />
      <div className="rounded-2xl bg-bg p-4">
        <p className="text-sm font-bold">Contact details (private)</p>
        <p className="mb-3 text-xs text-muted">These are not shown to parents. Parents reach you by sharing their interest.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <F name="phones" label="Phone numbers" value={d.phones.join("\n")} rows={2} hint="One per line." />
          <div className="space-y-4"><F name="email" label="Admissions email" value={d.email} /><F name="website" label="Website" value={d.website} /></div>
        </div>
      </div>
      <Err msg={state?.error} />
      {state?.ok && <p role="status" className="rounded-2xl bg-mint px-4 py-3 text-sm font-medium">✅ Saved. Your page is updated.</p>}
      <button disabled={pending} className="btn btn-primary">{pending ? "Saving..." : "Save changes"}</button>
    </form>
  );
}
