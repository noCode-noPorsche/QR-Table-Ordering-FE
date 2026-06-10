"use client";

import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/src/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

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

export default function RefreshTokenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  );
}
