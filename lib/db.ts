import bcrypt from "bcryptjs";
import { SEED_SCHOOLS } from "./seed";

const SEED_VERSION = "2";
const CHOICE_SLUG = "apple-blossom-sector-46";

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
  ddl.push(
    `alter table schools add column if not exists choice boolean not null default false`,
    `alter table schools add column if not exists edited boolean not null default false`,
    `create table if not exists meta (key text primary key, value text not null)`);
  for (const s of ddl) await run(s);

  // Starter data: inserted on first run, and refreshed when SEED_VERSION changes.
  // Pages a school or admin has edited by hand are never overwritten.
  const current = (await run(`select value from meta where key='seed_version'`))[0]?.value;
  if (current !== SEED_VERSION) {
    for (const s of SEED_SCHOOLS) {
      const args = [s.slug, s.name, s.locality, s.address, s.kind, s.lat, s.lng, s.min_age_months, s.has_daycare, s.fee_from, s.partner, s.partner, JSON.stringify(s.data)];
      const exists = (await run(`select edited from schools where slug=$1`, [s.slug]))[0];
      if (!exists) {
        await run(
          `insert into schools (slug,name,locality,address,kind,lat,lng,min_age_months,has_daycare,fee_from,partner,auto_unlock,data)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb) on conflict (slug) do nothing`, args);
      } else if (!exists.edited) {
        await run(
          `update schools set name=$2,locality=$3,address=$4,kind=$5,lat=$6,lng=$7,min_age_months=$8,has_daycare=$9,fee_from=$10,data=$13::jsonb,updated_at=now()
           where slug=$1 and ($11::boolean is not null) and ($12::boolean is not null)`, args);
      }
    }
    if (!current || Number(current) < 2) await run(`update schools set choice=(slug=$1)`, [CHOICE_SLUG]);
    await run(`insert into meta (key,value) values ('seed_version',$1) on conflict (key) do update set value=$1`, [SEED_VERSION]);
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
