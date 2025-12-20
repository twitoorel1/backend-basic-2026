import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/options";
import jwt from "jsonwebtoken";
import { useSession } from "next-auth/react";

// const publicRoutes = ["/login", "/unauthorized"];

const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; time: number }>();

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

  // let userRole = null;
  // console.log(session?.user?.role);
  // if (session?.ac_token) {
  //   try {
  //     const decoded: any = jwt.verify(session.ac_token, process.env.NEXTAUTH_SECRET as string) as { role: string };
  //     console.log(decoded);
  //     userRole = decoded.role;
  //   } catch (error: any) {
  //     const response = NextResponse.redirect(new URL("/", request.url));
  //     response.cookies.delete("ac_token");
  //     response.cookies.delete("rf_token");
  //     return response;
  //   }
  // }

  const protectedRoutes = ["/settings", "/profile", "/inventory"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (!isLoggedIn && isProtectedRoute) {
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/dashboard")) {
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && pathname === "/login") {
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && session?.user?.role !== "admin") {
    url.pathname = "/unauthorized";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Security Headers
  // const response = NextResponse.next({
  //   request: {
  //     headers: request.headers,
  //   },
  // });
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' blob: data: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' " + process.env.API_URL, // תוסיף API שלך אחר כך
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  if (session?.user?.role) {
    response.headers.set("x-user-role", session.user.role);
    // response.headers.set("x-user-id", session.user.id);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
