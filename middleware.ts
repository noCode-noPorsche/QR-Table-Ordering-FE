import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = Boolean(request.cookies.get("accessToken")?.value);

  if (privatePaths.some((p) => pathname.startsWith(p)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (unAuthPaths.some((p) => pathname.startsWith(p)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
