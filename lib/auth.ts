import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { q } from "./db";
import type { User } from "./types";

const COOKIE = "sc_session";
const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "dev-only-secret-change-me-in-production");

export async function createSession(userId: number) {
  const token = await new SignJWT({ uid: userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const rows = await q<User>(
      `select u.id,u.email,u.name,u.role,u.school_id,u.status,u.phone,u.designation,u.created_at, s.name || ', ' || s.locality as school_name
       from users u left join schools s on s.id=u.school_id where u.id=$1`, [payload.uid]);
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<User> {
  const u = await getUser();
  if (!u || u.role !== "admin") redirect("/login");
  return u;
}

export async function requireSchoolUser(): Promise<User> {
  const u = await getUser();
  if (!u) redirect("/login");
  if (u.role === "admin") redirect("/admin");
  return u;
}
