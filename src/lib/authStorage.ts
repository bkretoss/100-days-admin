import type { AuthUser } from "../types";

const TOKEN_KEY = "100days_admin_token";
const USER_KEY = "100days_admin_user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Returns the stored user if a token exists; otherwise null. */
export function getStoredUser(): AuthUser | null {
  const token = getToken();
  if (!token) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      // fall through to minimal user
    }
  }
  return { name: "Admin", role: "Admin", email: "" };
}
