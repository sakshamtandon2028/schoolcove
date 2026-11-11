import Link from "next/link";
import { allSchools } from "@/lib/schools";
import { SignupForm } from "@/components/AuthForms";

export const dynamic = "force-dynamic";
export const metadata = { title: "For schools: get admission enquiries from parents" };

export default async function ForSchools() {
  const schools = await allSchools();
  const price = Number(process.env.LEAD_PRICE || 500);
  return (
    <div className="container-x pt-10">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow">For preschools, daycares and schools</p>
          <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">Meet parents who have already asked to hear from you.</h1>
          <p className="mt-4 text-lg leading-7 text-muted">SchoolCove is free for parents. When a parent fills the interest form on your page, you get their name, phone number, child's age and what they are looking for.</p>
          <div className="mt-7 space-y-3">
            {[
              ["📥", "Warm enquiries, not cold lists", "Every enquiry is a parent who chose your school and agreed to be contacted."],
              ["📝", "Your page, your facts", "Update fees, timings, photos and admission status any time. Changes go live immediately."],
              ["📊", "A simple dashboard", "See page views and enquiries, mark who you have called, and download everything as an Excel sheet."],
              ["💳", "Pay only for enquiries", `No listing fee. Enquiries are charged at ₹${price.toLocaleString("en-IN")} each.`],
            ].map(([e, t, b]) => (
              <div key={t} className="card flex gap-4 p-4"><span className="text-2xl" aria-hidden="true">{e}</span><div><p className="font-bold">{t}</p><p className="text-sm leading-6 text-muted">{b}</p></div></div>
            ))}
          </div>
          <div className="mt-8">
            <p className="font-bold">How it works</p>
            <ol className="mt-3 space-y-2 text-sm leading-6">
              {["Select your school and create an account.", "We verify that you represent the school, usually within a day.", "Log in to see enquiries and keep your page up to date."].map((s, i) => (
                <li key={s} className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">{i + 1}</span>{s}</li>
              ))}
            </ol>
          </div>
        </div>
        <div id="signup" className="scroll-mt-24">
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl">Claim your school</h2>
            <p className="mb-5 mt-1 text-sm text-muted">Already have an account? <Link href="/login" className="font-semibold text-coral hover:underline">Log in</Link></p>
            <SignupForm schools={schools.map((s) => ({ id: s.id, label: `${s.name}, ${s.locality}` }))} />
          </div>
        </div>
      </div>
    </div>
  );
}
