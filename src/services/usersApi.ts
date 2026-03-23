import axios from "axios";
import { getToken } from "../lib/authStorage";

const USERS_URL = "https://my100days-mobile.replit.app/api/admin/users";

export interface AdminUsersApiRow {
  /** API user id (UUID) for routing to /users/:id */
  id: string;
  /** Maps from API displayName */
  name: string;
  email: string;
  /** Maps from API profileImageUrl */
  image: string | null;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickId(o: Record<string, unknown>): string {
  const id = o.id;
  if (typeof id === "string" && id.trim()) return id.trim();
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  return "";
}

function mapRow(raw: unknown): AdminUsersApiRow | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = pickId(o);
  const name = pickString(o, ["displayName", "name", "fullName", "full_name", "username"]);
  const email = pickString(o, ["email"]);
  const image = pickString(o, ["profileImageUrl", "image", "avatar", "picture", "photo", "profileImage", "profile_image"]);
  if (!name && !email) return null;
  return {
    id,
    name: name ?? "",
    email: email ?? "",
    image,
  };
}

function extractList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.data)) return d.data;
  if (d.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    if (Array.isArray(inner.users)) return inner.users;
    if (Array.isArray(inner.data)) return inner.data;
    if (Array.isArray(inner.items)) return inner.items;
  }
  if (Array.isArray(d.users)) return d.users;
  if (Array.isArray(d.results)) return d.results;
  if (Array.isArray(d.items)) return d.items;
  return [];
}

export async function fetchAdminUsers(page: number, limit: number): Promise<AdminUsersApiRow[]> {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  const { data } = await axios.get(USERS_URL, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return extractList(data)
    .map(mapRow)
    .filter((r): r is AdminUsersApiRow => r !== null);
}

export interface AdminUserDetail {
  email: string;
  displayName: string;
  profileImageUrl: string | null;
  jobTitle: string;
  industry: string;
  location: string;
}

function unwrapPayload(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.data && typeof o.data === "object" && !Array.isArray(o.data)) {
    return o.data as Record<string, unknown>;
  }
  return o;
}

export async function deleteAdminUser(userId: string): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  await axios.delete(`${USERS_URL}/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchAdminUserById(userId: string): Promise<AdminUserDetail> {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  const { data } = await axios.get(`${USERS_URL}/${encodeURIComponent(userId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const o = unwrapPayload(data);
  if (!o) {
    throw new Error("Invalid user response");
  }
  const profile = o.profile && typeof o.profile === "object" ? (o.profile as Record<string, unknown>) : null;
  const jobTitle = pickString(profile ?? {}, ["jobTitle", "job_title"]) ?? "";
  const industry = pickString(profile ?? {}, ["industry"]) ?? "";
  const location = pickString(profile ?? {}, ["location"]) ?? "";
  const email = pickString(o, ["email"]) ?? "";
  const displayName = pickString(o, ["displayName", "name"]) ?? "";
  const profileImageUrl = pickString(o, ["profileImageUrl", "image", "avatar"]);
  return {
    email,
    displayName,
    profileImageUrl,
    jobTitle,
    industry,
    location,
  };
}
