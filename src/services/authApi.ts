import axios from "axios";
import type { AuthUser } from "../types";

// const ADMIN_LOGIN_URL = "https://my100days-mobile.replit.app/api/admin/login";
const ADMIN_LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/login`;

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

function extractToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (typeof d.token === "string") return d.token;
  if (typeof d.accessToken === "string") return d.accessToken;
  if (typeof d.access_token === "string") return d.access_token;
  if (d.data && typeof d.data === "object") {
    const inner = d.data as Record<string, unknown>;
    if (typeof inner.token === "string") return inner.token;
    if (typeof inner.accessToken === "string") return inner.accessToken;
    if (typeof inner.access_token === "string") return inner.access_token;
  }
  return null;
}

function mapUserFromResponse(data: unknown, email: string): AuthUser {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const u = d.user;
    if (u && typeof u === "object") {
      const user = u as Record<string, unknown>;
      const nameFromEmail = email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        name: typeof user.name === "string" ? user.name : nameFromEmail,
        role: typeof user.role === "string" ? user.role : "Admin",
        email: typeof user.email === "string" ? user.email : email,
      };
    }
  }
  const name = email
    .split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { name, role: "Admin", email };
}

export async function adminLogin(
  credentials: AdminLoginCredentials
): Promise<{ token: string; user: AuthUser }> {
  const { data } = await axios.post(ADMIN_LOGIN_URL, credentials, {
    headers: { "Content-Type": "application/json" },
  });
  const token = extractToken(data);
  if (!token) {
    throw new Error("Login succeeded but no token was returned.");
  }
  const user = mapUserFromResponse(data, credentials.email);
  return { token, user };
}
