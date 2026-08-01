import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "slogan_admin";
/** Scopes the session cookie to admin routes. Deletion must pass the SAME path or the cookie survives. */
const COOKIE_PATH = "/admin";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET;
}

export function isAdminAuthConfigured() {
  return Boolean(process.env.ADMIN_DASHBOARD_PASSWORD && getSecret());
}

function sign(value: string) {
  const secret = getSecret();
  if (!secret) throw new Error("Missing ADMIN_SESSION_SECRET.");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function verifyPassword(password: string) {
  const expected = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createAdminSession() {
  const issuedAt = Date.now().toString();
  const token = `${issuedAt}.${sign(issuedAt)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
    path: COOKIE_PATH,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: COOKIE_NAME, path: COOKIE_PATH });
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !getSecret()) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  if (Date.now() - Number(issuedAt) > MAX_AGE_SECONDS * 1000) return false;

  const expected = sign(issuedAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}
