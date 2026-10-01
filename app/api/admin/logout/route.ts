import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/adminAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), "", { path: "/", maxAge: 0 });
  return response;
}
