"use client";

import { useAppStore } from "@/components/app-provider";
import { useRouter } from "@/i18n/navigation";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function LogoutMain() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);

  useEffect(() => {
    if (
      (!ref.current || !refreshTokenFromUrl || !accessTokenFromUrl) &&
      ((refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromUrl &&
          accessTokenFromUrl === getAccessTokenFromLocalStorage()))
    ) {
      ref.current = mutateAsync;
      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        router.push("/login");
        setRole(undefined);
        disconnectSocket();
      });
    } else if (accessTokenFromUrl !== getAccessTokenFromLocalStorage()) {
      router.push("/");
    }
  }, [
    mutateAsync,
    router,
    refreshTokenFromUrl,
    accessTokenFromUrl,
    setRole,
    disconnectSocket,
  ]);
  return null;
}

export default function Logout() {
  return (
    <Suspense>
      <LogoutMain />
    </Suspense>
  );
}
