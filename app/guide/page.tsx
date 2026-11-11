import Link from "next/link";

export const metadata = { title: "Parent guide: how to choose a preschool or daycare in Gurugram", description: "Dos and don'ts, an age guide and a 10-question visit checklist for parents choosing a preschool or daycare.", alternates: { canonical: "/guide" } };

const DO = [
  ["Visit during school hours", "Watch a real class for ten minutes. Are children busy and calm? Do teachers get down to the child's eye level?"],
  ["Ask for the full fee card", "Get one-time charges, monthly fees and extras (meals, transport, activities, uniform) in writing. Compare first-year totals."],
  ["Check safety yourself", "Look for CCTV, a guarded gate, a visitor register, covered sockets, clean washrooms and a first-aid kit. Ask who can pick up your child."],
  ["Ask about the settling-in period", "Good schools let a parent stay nearby for the first few days and increase hours slowly."],
  ["Do the commute at drop-off time", "Drive or walk the route at the real time. A short distance can be a long ride in Gurugram traffic."],
  ["Talk to two current parents", "Ask what they like and what they would change. Read recent Google reviews for patterns."],
  ["Meet the class teacher", "The person who spends the day with your child matters more than the brand name."],
];
const DONT = [
  ["Don't choose on the building alone", "Bright walls and big lobbies are nice. Warm, steady caregivers matter more."],
  ["Don't pay under pressure", "\"Only two seats left\" is a common line. Ask for the refund policy in writing before paying anything."],
  ["Don't ignore the staff ratio", "For babies, look for about one adult for every three or four children. For 2 to 3 year olds, about one for every eight to ten, with a helper."],
  ["Don't push academics too early", "Under five, play is the work. Be careful with schools that promise reading and writing at age two."],
  ["Don't skip the sick-child policy", "Ask what happens when your child, or another child, is unwell. Keep a backup plan."],
  ["Don't assume daycare hours match preschool hours", "They are often different, and holidays differ too. Ask for the yearly calendar."],
];
const AGES = [
  ["6 months to 2 years", "Daycare / infant care", "Safe sleep and feeding routines, a consistent caregiver, clean spaces and a low child to adult ratio."],
  ["2 to 3 years", "Playgroup / Pre-Nursery", "Short days, lots of free play, songs and stories. Help with toilet training."],
  ["3 to 4 years", "Nursery", "Play-based learning, early language and numbers through activities, outdoor time every day."],
  ["4 to 6 years", "KG (Junior and Senior)", "School readiness: listening, sharing, early reading and writing at the child's pace."],
];
const VISIT = [
  "How many children and adults are in my child's class?",
  "What does a normal day look like, hour by hour?",
  "How do you comfort a crying child in the first weeks?",
  "What is included in the fee, and what is extra?",
  "Can parents see CCTV, or get daily photos and updates?",
  "What meals are served, and how do you handle allergies?",
  "What training do teachers and helpers have? How long have they been here?",
  "Who is allowed to pick up my child, and how do you check?",
  "What is the notice period and refund policy if we leave?",
  "Where do most children go after finishing here?",
];
const DOCS = ["Child's birth certificate", "Child's Aadhaar card (if available)", "Parents' ID and address proof", "Passport-size photos of child and parents", "Immunisation record"];

export default function Guide() {
  return (
    <div className="container-x pt-8">
      <p className="eyebrow">Parent guide</p>
      <h1 className="mt-1 max-w-3xl text-4xl sm:text-5xl">How to choose a preschool or daycare</h1>
      <p className="mt-3 max-w-2xl text-lg leading-7 text-muted">A short, plain guide. What to do, what to avoid, and what to ask when you visit.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-2xl">✅ What to do</h2>
          <ul className="mt-4 space-y-4">{DO.map(([t, b]) => <li key={t} className="flex gap-3"><span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-mint text-sm text-emerald-700">✓</span><div><p className="font-bold">{t}</p><p className="text-sm leading-6 text-muted">{b}</p></div></li>)}</ul>
        </section>
        <section className="card p-6">
          <h2 className="text-2xl">🚫 What not to do</h2>
          <ul className="mt-4 space-y-4">{DONT.map(([t, b]) => <li key={t} className="flex gap-3"><span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blush text-sm text-coral">✕</span><div><p className="font-bold">{t}</p><p className="text-sm leading-6 text-muted">{b}</p></div></li>)}</ul>
        </section>
      </div>

      <section className="card mt-5 p-6">
        <h2 className="text-2xl">🧒 Which programme fits which age?</h2>
        <p className="mt-1 text-sm text-muted">Names and cut-off dates differ between schools, so always confirm the age rule for the session you want.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{AGES.map(([age, name, what]) => <div key={age} className="rounded-2xl bg-lavender/60 p-4"><p className="text-sm font-bold text-coral">{age}</p><p className="font-bold">{name}</p><p className="mt-1 text-sm leading-6 text-ink/80">{what}</p></div>)}</div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section id="visit" className="card scroll-mt-24 p-6">
          <h2 className="text-2xl">📋 Visit checklist: 10 questions to ask</h2>
          <ol className="mt-4 space-y-2.5">{VISIT.map((v, i) => <li key={v} className="flex gap-3 text-sm leading-6"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">{i + 1}</span>{v}</li>)}</ol>
        </section>
        <section className="card p-6">
          <h2 className="text-2xl">📄 Documents usually needed</h2>
          <ul className="mt-4 space-y-2">{DOCS.map((d) => <li key={d} className="flex gap-2 text-sm leading-6"><span aria-hidden="true">•</span>{d}</li>)}</ul>
          <p className="mt-4 rounded-2xl bg-sun p-3 text-sm leading-6">Each school has its own list. Check the Admission tab on the school's page.</p>
        </section>
      </div>

      <div className="mt-8 text-center"><Link href="/schools" className="btn btn-primary !min-h-12 px-8 text-base">Browse schools in Gurugram</Link></div>
    </div>
  );
}
