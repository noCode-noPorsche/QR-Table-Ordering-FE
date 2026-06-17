import { Role } from "@/constants/type";
import { TokenPayload } from "@/types/jwt.types";
import jwt from "jsonwebtoken";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

const managePaths = ["/vi/manage", "/en/manage"];
const guestPaths = ["/vi/guest", "/en/guest"];
const onlyOwnerPaths = ["/vi/manage/accounts", "/en/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/vi/login", "/en/login"];
const loginPaths = ["/vi/login", "/en/login"];

export function proxy(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);

  const { pathname, searchParams } = request.nextUrl;
  const response = handleI18nRouting(request);

  // Chỉ check cookies trên private paths
  // const needsAuth =
  //   privatePaths.some((p) => pathname.includes(p)) ||
  //   onlyOwnerPaths.some((p) => pathname.includes(p));

  // // Nếu là public path, skip auth check, chỉ handle i18n
  // if (!needsAuth) {
  //   return handleI18nRouting(request);
  // }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. Chưa đăng nhập thì không cho vào private path
  if (privatePaths.some((p) => pathname.startsWith(p)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearToken", "true");
    return NextResponse.redirect(url);
    // response.headers.set("x-middleware-rewrite", url.toString());
    // return response;
  }
  // 2. Đã đăng nhập
  if (refreshToken) {
    // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some((p) => pathname.startsWith(p)) && refreshToken) {
      if (
        loginPaths.some((p) => pathname.startsWith(p)) &&
        searchParams.get("accessToken")
      ) {
        return response;
      }
      return NextResponse.redirect(new URL("/", request.nextUrl));
      // response.headers.set(
      //   "x-middleware-rewrite",
      //   new URL("/", request.nextUrl).toString(),
      // );
      // return response;
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
      // response.headers.set("x-middleware-rewrite", url.toString());
      // return response;
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
      // response.headers.set(
      //   "x-middleware-rewrite",
      //   new URL("/", request.nextUrl).toString(),
      // );
      // return response;
    }
    // return response;
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
