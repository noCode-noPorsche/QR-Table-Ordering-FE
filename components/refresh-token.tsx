"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Những page sau sẽ không check refresh token
const UNAUTHORIZED_PATHS = ["/login", "/logout", "/refresh-token", "/register"];

export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (UNAUTHORIZED_PATHS.some((p) => pathname.startsWith(p))) {
      return;
    }
    let interval: any = null;

    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thờ gian TIMEOUT
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s sẽ cho check 1 lần
    const TIMEOUT = 1000;
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
      });
    }, TIMEOUT);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [pathname, router]);
  return null;
}
