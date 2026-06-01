import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = Boolean(request.cookies.get("accessToken")?.value);
  const refreshToken = Boolean(request.cookies.get("refreshToken")?.value);

  // Chưa đăng nhập thì không cho vào private path
  if (privatePaths.some((p) => pathname.startsWith(p)) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Đăng nhập rồi thì không vào login nữa
  if (unAuthPaths.some((p) => pathname.startsWith(p)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Trường hợp đăng nhập rồi, nhưng access token lại hết hạn
  if (
    privatePaths.some((p) => pathname.startsWith(p)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/logout", request.nextUrl);
    url.searchParams.set("refreshToken", String(refreshToken ?? ""));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
