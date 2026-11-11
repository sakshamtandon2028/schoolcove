"use client";
import { useActionState, useTransition, type FormEvent } from "react";
import type { FormState } from "@/lib/actions";

// Submits a server action without clearing the form, so people keep what they typed if there is an error.
export function useForm(fn: (prev: FormState, fd: FormData) => Promise<FormState>) {
  const [state, action, actionPending] = useActionState(fn, null);
  const [transitionPending, start] = useTransition();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(() => action(fd));
  };
  return { state, onSubmit, pending: actionPending || transitionPending };
}
