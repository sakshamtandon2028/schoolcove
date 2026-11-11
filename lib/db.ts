import bcrypt from "bcryptjs";
import { SEED_SCHOOLS } from "./seed";

type Row = Record<string, any>;
type Runner = (text: string, params?: any[]) => Promise<Row[]>;

const g = globalThis as unknown as { __sc_db?: Promise<Runner> };

async function connect(): Promise<Runner> {
  let run: Runner;
  if (process.env.DATABASE_URL) {
    const postgres = (await import("postgres")).default;
    const sql = postgres(process.env.DATABASE_URL, { max: 3, prepare: false, onnotice: () => {} });
    run = async (text, params = []) => (await sql.unsafe(text, params as any)) as unknown as Row[];
  } else {
    // Local development: a file-based Postgres, no setup needed.
    const { PGlite } = await import("@electric-sql/pglite");
    const fs = await import("fs");
    fs.mkdirSync(".data", { recursive: true });
    const db = new PGlite(".data/pglite");
    run = async (text, params = []) => (await db.query(text, params)).rows as Row[];
  }
  await migrate(run);
  return run;
}

async function migrate(run: Runner) {
  const ddl = [
    `create table if not exists schools (
      id serial primary key, slug text unique not null, name text not null, locality text not null, address text not null,
      kind text not null default 'preschool', lat double precision, lng double precision, min_age_months int,
      has_daycare boolean not null default false, fee_from int, promoted boolean not null default false,
      partner boolean not null default false, auto_unlock boolean not null default false, views int not null default 0,
      data jsonb not null, updated_at timestamptz not null default now())`,
    `create table if not exists users (
      id serial primary key, email text unique not null, password_hash text not null, name text not null,
      role text not null default 'school', school_id int references schools(id), status text not null default 'pending',
      phone text, designation text, created_at timestamptz not null default now())`,
    `create table if not exists leads (
      id serial primary key, school_id int not null references schools(id), parent_name text not null, phone text not null,
      email text, child_age text, program text, start_month text, message text, consent boolean not null default true,
      status text not null default 'new', unlocked boolean not null default false, created_at timestamptz not null default now())`,
    `create table if not exists reviews (
      id serial primary key, school_id int not null references schools(id), name text not null, rating int not null,
      body text not null, status text not null default 'pending', created_at timestamptz not null default now())`,
  ];
  for (const s of ddl) await run(s);

  const [{ n }] = await run(`select count(*)::int as n from schools`);
  if (n === 0) {
    for (const s of SEED_SCHOOLS) {
      await run(
        `insert into schools (slug,name,locality,address,kind,lat,lng,min_age_months,has_daycare,fee_from,partner,auto_unlock,data)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb) on conflict (slug) do nothing`,
        [s.slug, s.name, s.locality, s.address, s.kind, s.lat, s.lng, s.min_age_months, s.has_daycare, s.fee_from, s.partner, s.partner, JSON.stringify(s.data)]
      );
    }
  }
  const email = (process.env.ADMIN_EMAIL || "admin@schoolcove.in").toLowerCase();
  const existing = await run(`select id from users where role='admin' limit 1`);
  if (existing.length === 0) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "schoolcove-admin", 10);
    await run(
      `insert into users (email,password_hash,name,role,status) values ($1,$2,'SchoolCove Admin','admin','approved') on conflict (email) do nothing`,
      [email, hash]
    );
  }
}

export async function q<T = Row>(text: string, params: any[] = []): Promise<T[]> {
  if (!g.__sc_db) g.__sc_db = connect().catch((e) => { g.__sc_db = undefined; throw e; });
  const run = await g.__sc_db;
  const rows = await run(text, params);
  // PGlite returns jsonb as objects; postgres.js too. Normalise just in case a driver returns a string.
  for (const r of rows) if (typeof r.data === "string") { try { r.data = JSON.parse(r.data); } catch {} }
  return rows as T[];
}
