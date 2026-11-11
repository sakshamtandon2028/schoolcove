export type SchoolData = {
  tagline?: string;
  about: string;
  established?: number;
  curriculum?: string;
  grades?: string;
  network?: string;
  programs: { name: string; age?: string; note?: string }[];
  daycare?: { hours?: string; ages?: string; note?: string };
  hours?: string;
  facilities: string[];
  activities?: string[];
  safety?: string[];
  meals?: string;
  transport?: string;
  ratio?: string;
  fees?: { items: { label: string; amount: string }[]; note?: string; source?: string };
  admission?: { status?: string; steps?: string[]; documents?: string[]; note?: string };
  awards?: string[];
  highlights: { works: string[]; watch: string[]; ask: string[] };
  images: string[];
  phones: string[];
  email?: string;
  website?: string;
  social?: { facebook?: string; instagram?: string; youtube?: string; linkedin?: string };
  google?: { rating?: number; count?: number; placeId?: string };
  sources: string[];
};

export type School = {
  id: number;
  slug: string;
  name: string;
  locality: string;
  address: string;
  kind: "preschool" | "school";
  lat: number | null;
  lng: number | null;
  min_age_months: number | null;
  has_daycare: boolean;
  fee_from: number | null;
  promoted: boolean;
  choice: boolean;
  partner: boolean;
  auto_unlock: boolean;
  views: number;
  data: SchoolData;
};

export type Lead = {
  id: number;
  school_id: number;
  parent_name: string;
  phone: string;
  email: string | null;
  child_age: string | null;
  program: string | null;
  start_month: string | null;
  message: string | null;
  status: string;
  unlocked: boolean;
  created_at: Date;
  school_name?: string;
};

export type Review = {
  id: number;
  school_id: number;
  name: string;
  rating: number;
  body: string;
  status: string;
  created_at: Date;
  school_name?: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  role: "admin" | "school";
  school_id: number | null;
  status: "pending" | "approved" | "rejected";
  phone: string | null;
  designation: string | null;
  created_at: Date;
  school_name?: string;
};

export const LEAD_STATUSES = ["new", "contacted", "visit booked", "admitted", "not interested"] as const;
