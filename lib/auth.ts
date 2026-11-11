import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { q } from "./db";
import type { User } from "./types";

const COOKIE = "sc_session";
const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) throw new Error("SESSION_SECRET must be set to a long random value");
    return new TextEncoder().encode("dev-only-secret-change-me-in-production");
  }
  return new TextEncoder().encode(s);
};

export async function createSession(userId: number) {
  const token = await new SignJWT({ uid: userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("14d").sign(secret());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
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
