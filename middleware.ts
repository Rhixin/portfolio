import { NextRequest, NextResponse } from "next/server";
import { getAdminCookieName, verifyAdminSessionCookie } from "@/lib/adminAuth";

const PUBLIC_ADMIN_API_PATHS = ["/api/admin/login", "/api/admin/logout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/admin") && !PUBLIC_ADMIN_API_PATHS.includes(pathname);

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(getAdminCookieName())?.value;
  const authorized = verifyAdminSessionCookie(cookie);

  if (authorized) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
