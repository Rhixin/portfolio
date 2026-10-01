import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export function verifyAdminSessionCookie(cookieValue: string | undefined): boolean {
  const expected = process.env.ADMIN_SESSION_SECRET;
  if (!expected || !cookieValue) return false;
  return cookieValue === expected;
}

export function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  return secret;
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  const cookie = req.cookies.get(getAdminCookieName())?.value;
  if (!verifyAdminSessionCookie(cookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
