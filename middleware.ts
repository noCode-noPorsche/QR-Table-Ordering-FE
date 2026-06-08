import { Role } from "@/constants/type";
import { TokenPayload } from "@/types/jwt.types";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const onlyOwnerPaths = ["/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. Chưa đăng nhập thì không cho vào private path
  if (privatePaths.some((p) => pathname.startsWith(p)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearToken", "true");
    return NextResponse.redirect(url);
  }
  // 2. Đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((p) => pathname.startsWith(p)) && refreshToken) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    // 2.2 Đã đăng nhập rồi, nhưng access token lại hết hạn
    if (
      privatePaths.some((p) => pathname.startsWith(p)) &&
      !accessToken &&
      refreshToken
    ) {
      const url = new URL("/refresh-token", request.nextUrl);
      url.searchParams.set("refreshToken", String(refreshToken ?? ""));
      url.searchParams.set("redirectPath", pathname);
      return NextResponse.redirect(url);
    }
    // 2.3 Vào không đúng role, redirect về trang chủ
    const role = decodeToken(refreshToken).role;

    // Guest nhưng cố vào route owner
    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));
    // Không phải Guest nhưng cố vào route guest
    const isNotGuestToGuestPath =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));
    // Không phải Owner nhưng cố vào route owner
    const isNotOwnerToOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));

    if (
      isGuestGoToManagePath ||
      isNotGuestToGuestPath ||
      isNotOwnerToOwnerPath
    ) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login", "/guest/:path*"],
};
