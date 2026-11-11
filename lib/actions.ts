"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { q } from "./db";
import { createSession, destroySession, getUser, requireAdmin, requireSchoolUser } from "./auth";
import { LEAD_STATUSES } from "./types";

export type FormState = { ok?: boolean; error?: string } | null;

const str = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? "").trim().slice(0, max);
const validPhone = (p: string) => p.replace(/\D/g, "").length >= 10;
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* ---------- Parents ---------- */

export async function submitLead(_: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "company")) return { ok: true }; // honeypot for bots
  const schoolId = Number(fd.get("school_id"));
  const name = str(fd, "parent_name", 100), phone = str(fd, "phone", 20), email = str(fd, "email", 200).toLowerCase();
  if (!schoolId || !name) return { error: "Please enter your name." };
  if (!validPhone(phone)) return { error: "Please enter a valid phone number with at least 10 digits." };
  if (email && !validEmail(email)) return { error: "That email address does not look right." };
  if (fd.get("consent") !== "on") return { error: "Please tick the box so we can share your details with the school." };
  const school = (await q(`select id, auto_unlock from schools where id=$1`, [schoolId]))[0];
  if (!school) return { error: "We could not find that school. Please refresh and try again." };
  const dup = await q(
    `select id from leads where school_id=$1 and regexp_replace(phone,'\\D','','g')=$2 and created_at > now() - interval '7 days'`,
    [schoolId, phone.replace(/\D/g, "")]);
  if (dup.length) return { ok: true };
  await q(
    `insert into leads (school_id,parent_name,phone,email,child_age,program,start_month,message,unlocked)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [schoolId, name, phone, email || null, str(fd, "child_age", 40) || null, str(fd, "program", 60) || null,
     str(fd, "start_month", 40) || null, str(fd, "message", 600) || null, !!school.auto_unlock]);
  return { ok: true };
}

export async function submitReview(_: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, "company")) return { ok: true };
  const schoolId = Number(fd.get("school_id")), rating = Number(fd.get("rating"));
  const name = str(fd, "name", 80), body = str(fd, "body", 1200);
  if (!schoolId || !name) return { error: "Please enter your name." };
  if (!(rating >= 1 && rating <= 5)) return { error: "Please choose a star rating." };
  if (body.length < 20) return { error: "Please write at least a sentence or two about your experience." };
  await q(`insert into reviews (school_id,name,rating,body) values ($1,$2,$3,$4)`, [schoolId, name, Math.round(rating), body]);
  return { ok: true };
}

/* ---------- Accounts ---------- */

export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email", 200).toLowerCase(), password = String(fd.get("password") ?? "");
  const name = str(fd, "name", 100), schoolId = Number(fd.get("school_id"));
  if (!name) return { error: "Please enter your name." };
  if (!validEmail(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8) return { error: "Please choose a password with at least 8 characters." };
  if (!schoolId) return { error: "Please select your school." };
  if ((await q(`select id from users where email=$1`, [email])).length) return { error: "An account with this email already exists. Try logging in." };
  const hash = await bcrypt.hash(password, 10);
  const [u] = await q<{ id: number }>(
    `insert into users (email,password_hash,name,role,school_id,status,phone,designation) values ($1,$2,$3,'school',$4,'pending',$5,$6) returning id`,
    [email, hash, name, schoolId, str(fd, "phone", 20) || null, str(fd, "designation", 80) || null]);
  await createSession(u.id);
  redirect("/dashboard");
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email", 200).toLowerCase(), password = String(fd.get("password") ?? "");
  const u = (await q<{ id: number; password_hash: string; role: string }>(`select id,password_hash,role from users where email=$1`, [email]))[0];
  if (!u || !(await bcrypt.compare(password, u.password_hash))) return { error: "Email or password is incorrect." };
  await createSession(u.id);
  redirect(u.role === "admin" ? "/admin" : "/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}

/* ---------- School dashboard ---------- */

async function approvedSchoolUser() {
  const u = await requireSchoolUser();
  if (u.status !== "approved" || !u.school_id) redirect("/dashboard");
  return u as typeof u & { school_id: number };
}

export async function updateLeadStatus(fd: FormData) {
  const u = await getUser();
  if (!u) redirect("/login");
  const id = Number(fd.get("id")), status = str(fd, "status", 40);
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) return;
  if (u.role === "admin") await q(`update leads set status=$1 where id=$2`, [status, id]);
  else if (u.status === "approved" && u.school_id) await q(`update leads set status=$1 where id=$2 and school_id=$3 and unlocked`, [status, id, u.school_id]);
  revalidatePath("/dashboard"); revalidatePath("/admin");
}

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

export async function updateProfile(_: FormState, fd: FormData): Promise<FormState> {
  const me = await getUser();
  if (!me) redirect("/login");
  let schoolId: number;
  if (me.role === "admin") schoolId = Number(fd.get("school_id"));
  else schoolId = (await approvedSchoolUser()).school_id;
  const row = (await q(`select slug,data from schools where id=$1`, [schoolId]))[0];
  if (!row) return { error: "School not found." };
  const d = row.data;
  const about = str(fd, "about", 2000);
  if (about.length < 40) return { error: "Please write a few sentences about the school." };
  d.about = about;
  d.tagline = str(fd, "tagline", 160) || undefined;
  d.hours = str(fd, "hours", 160) || undefined;
  d.curriculum = str(fd, "curriculum", 120) || undefined;
  d.website = str(fd, "website", 300) || undefined;
  d.email = str(fd, "email", 200) || undefined;
  d.phones = lines(str(fd, "phones", 300));
  d.facilities = lines(str(fd, "facilities", 1500));
  d.meals = str(fd, "meals", 400) || undefined;
  d.transport = str(fd, "transport", 400) || undefined;
  d.ratio = str(fd, "ratio", 200) || undefined;
  d.images = lines(str(fd, "images", 3000)).filter((u) => u.startsWith("/") || u.startsWith("https://"));
  const feeItems = lines(str(fd, "fees", 2000)).map((l) => {
    const i = l.lastIndexOf(":");
    return i > 0 ? { label: l.slice(0, i).trim(), amount: l.slice(i + 1).trim() } : null;
  }).filter(Boolean);
  if (feeItems.length) d.fees = { items: feeItems, note: str(fd, "fees_note", 300) || "Shared by the school." };
  else delete d.fees;
  const admissionNote = str(fd, "admission_status", 200);
  d.admission = { ...(d.admission || {}), status: admissionNote || undefined };
  const feeFrom = Number(str(fd, "fee_from", 12).replace(/\D/g, "")) || null;
  await q(`update schools set data=$1::jsonb, fee_from=$2, updated_at=now() where id=$3`, [JSON.stringify(d), feeFrom, schoolId]);
  revalidatePath(`/schools/${row.slug}`); revalidatePath("/schools"); revalidatePath("/");
  return { ok: true };
}

/* ---------- Admin ---------- */

export async function setUserStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status", 20);
  if (!["approved", "rejected", "pending"].includes(status)) return;
  await q(`update users set status=$1 where id=$2 and role='school'`, [status, Number(fd.get("id"))]);
  revalidatePath("/admin");
}

export async function setLeadUnlocked(fd: FormData) {
  await requireAdmin();
  await q(`update leads set unlocked=$1 where id=$2`, [fd.get("unlocked") === "1", Number(fd.get("id"))]);
  revalidatePath("/admin");
}

export async function setReviewStatus(fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status", 20), id = Number(fd.get("id"));
  if (status === "delete") await q(`delete from reviews where id=$1`, [id]);
  else if (["approved", "pending"].includes(status)) await q(`update reviews set status=$1 where id=$2`, [status, id]);
  revalidatePath("/admin");
}

export async function setSchoolFlag(fd: FormData) {
  await requireAdmin();
  const flag = str(fd, "flag", 20);
  if (!["promoted", "partner", "auto_unlock"].includes(flag)) return;
  await q(`update schools set ${flag}=$1 where id=$2`, [fd.get("value") === "1", Number(fd.get("id"))]);
  revalidatePath("/admin"); revalidatePath("/schools"); revalidatePath("/");
}
