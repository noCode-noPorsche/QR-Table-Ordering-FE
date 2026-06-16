"use client";
// import { Metadata } from "next";
import { Suspense } from "react";

import { useRouter } from "@/i18n/navigation";
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function RefreshToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");

  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          if (redirectPathname) {
            router.push(redirectPathname || "/");
          }
        },
      });
    } else {
      router.push("/");
    }
  }, [redirectPathname, router, refreshTokenFromUrl]);
  return <div>Refresh Token</div>;
}

// export const metadata: Metadata = {
//   title: "Refresh Token Redirect",
//   description: "Refresh token redirect",
//   robots: {
//     index: false,
//   },
// };

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  );
}
