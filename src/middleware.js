import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  const publicAuthPages = ["/login", "/register"];
  const protectedRoutes = ["/dashboard", "/admin", "/profile"];

  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthPage = publicAuthPages.some(route =>
    pathname.startsWith(route)
  );

  // 1) If visiting protected page & no token → redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2) If token exists → verify it
  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      // 2a) If trying to access /admin → check role
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // 3) If user is logged in & tries to visit /login → redirect to dashboard
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

    } catch {
      // Token invalid → remove and redirect to login
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
  ],
};
