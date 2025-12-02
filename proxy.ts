import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("better-auth.session_token") || request.cookies.get("__Secure-better-auth.session_token");
  const isAuth = !!sessionCookie;

  const { pathname } = request.nextUrl;

  // Redirect to /board if logged in and trying to access login/signup
  if (isAuth && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup"],
};
