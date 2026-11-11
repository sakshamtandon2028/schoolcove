"use client";
import { useForm } from "./useForm";
import { useEffect, useId, useRef, useState } from "react";
import { submitLead } from "@/lib/actions";

export default function LeadForm({ schoolId, schoolName, programs, label = "📞 Get contact details", className = "btn btn-primary w-full" }:
  { schoolId: number; schoolName: string; programs: string[]; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const { state, onSubmit, pending } = useForm(submitLead);
  const ref = useRef<HTMLDialogElement>(null);
  const uid = useId();
  useEffect(() => { if (open) ref.current?.showModal(); else ref.current?.close(); }, [open]);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>{label}</button>
      <dialog ref={ref} onClose={() => setOpen(false)} onClick={(e) => { if (e.target === ref.current) setOpen(false); }}
        className="m-auto w-[min(34rem,calc(100vw-1.5rem))] rounded-3xl p-0 backdrop:bg-ink/50">
        <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Share your interest</p>
              <h2 className="mt-1 text-2xl leading-tight">{schoolName}</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-2 text-xl leading-none text-muted hover:bg-blush">✕</button>
          </div>

          {state?.ok ? (
            <div className="py-10 text-center" role="status">
              <div className="tick mx-auto flex size-16 items-center justify-center rounded-full bg-mint text-3xl">✅</div>
              <h3 className="mt-4 font-display text-2xl font-semibold">Lovely, you're all set!</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">We have passed your details to the admissions team at {schoolName}. They will call or message you, usually within one or two working days.</p>
              <button type="button" className="btn btn-ghost mt-5" onClick={() => setOpen(false)}>Close</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-4 space-y-3">
              <p className="text-sm leading-6 text-muted">Fill this short form and the school's admissions team will contact you with fees, timings and visit slots. Free for parents, no spam.</p>
              <input type="hidden" name="school_id" value={schoolId} />
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="label" htmlFor={`${uid}-name`}>Your name *</label><input id={`${uid}-name`} name="parent_name" required maxLength={100} autoComplete="name" className="input" placeholder="Parent's name" /></div>
                <div><label className="label" htmlFor={`${uid}-phone`}>Phone / WhatsApp *</label><input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" required minLength={10} maxLength={20} defaultValue="+91 " autoComplete="tel" className="input" /></div>
              </div>
              <div><label className="label" htmlFor={`${uid}-email`}>Email <span className="font-normal text-muted">(optional)</span></label><input id={`${uid}-email`} name="email" type="email" maxLength={200} autoComplete="email" className="input" placeholder="you@example.com" /></div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div><label className="label" htmlFor={`${uid}-age`}>Child's age</label>
                  <select id={`${uid}-age`} name="child_age" className="input" defaultValue="">
                    <option value="">Select</option>
                    {["Under 1 year", "1 to 2 years", "2 to 3 years", "3 to 4 years", "4 to 5 years", "5 to 6 years", "Above 6 years"].map((a) => <option key={a}>{a}</option>)}
                  </select></div>
                <div><label className="label" htmlFor={`${uid}-prog`}>Interested in</label>
                  <select id={`${uid}-prog`} name="program" className="input" defaultValue="">
                    <option value="">Select</option>
                    {programs.map((p) => <option key={p}>{p}</option>)}
                    <option>Not sure yet</option>
                  </select></div>
                <div><label className="label" htmlFor={`${uid}-start`}>Start from</label>
                  <select id={`${uid}-start`} name="start_month" className="input" defaultValue="">
                    <option value="">Select</option>
                    {["Immediately", "Within 3 months", "Next academic session", "Just exploring"].map((a) => <option key={a}>{a}</option>)}
                  </select></div>
              </div>
              <div><label className="label" htmlFor={`${uid}-msg`}>Anything you want to ask? <span className="font-normal text-muted">(optional)</span></label><textarea id={`${uid}-msg`} name="message" rows={2} maxLength={600} className="input" placeholder="For example: daycare timings, fees, transport" /></div>
              <label className="flex items-start gap-2.5 text-sm leading-5 text-muted">
                <input type="checkbox" name="consent" required className="mt-0.5 size-5 shrink-0 accent-[#d23f3f]" />
                <span>I agree that SchoolCove can share these details with {schoolName} so the school can contact me.</span>
              </label>
              {state?.error && <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-medium">{state.error}</p>}
              <button type="submit" disabled={pending} className="btn btn-primary w-full !min-h-12 text-base">{pending ? "Sending..." : "Share my interest"}</button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
