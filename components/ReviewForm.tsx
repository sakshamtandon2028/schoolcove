"use client";
import { useForm } from "./useForm";
import { useState } from "react";
import { submitReview } from "@/lib/actions";

export default function ReviewForm({ schoolId }: { schoolId: number }) {
  const { state, onSubmit, pending } = useForm(submitReview);
  const [rating, setRating] = useState(0);
  if (state?.ok) return <p role="status" className="rounded-2xl bg-mint p-4 text-sm font-medium">✅ Thank you. Your review will appear here once our team has checked it.</p>;
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="school_id" value={schoolId} />
      <input type="hidden" name="rating" value={rating} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <span className="label">Your rating</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)}
              className={`text-3xl leading-none ${n <= rating ? "text-amber-400" : "text-line"}`}>★</button>
          ))}
        </div>
      </div>
      <div><label className="label" htmlFor="rv-name">Your name</label><input id="rv-name" name="name" required maxLength={80} className="input" placeholder="For example: Priya, parent of a Nursery child" /></div>
      <div><label className="label" htmlFor="rv-body">Your experience</label><textarea id="rv-body" name="body" required rows={3} maxLength={1200} className="input" placeholder="What did you like? What should other parents know?" /></div>
      {state?.error && <p role="alert" className="rounded-2xl bg-blush px-4 py-3 text-sm font-medium">{state.error}</p>}
      <button disabled={pending} className="btn btn-primary">{pending ? "Sending..." : "Submit review"}</button>
    </form>
  );
}
