"use client";
// import { Metadata } from "next";
import { Suspense } from "react";

// export const metadata: Metadata = {
//   title: "Google Login Redirect",
//   description: "Google Login Redirect",
//   robots: {
//     index: false,
//   },
// };

import { useAppStore } from "@/components/app-provider";
import { useRouter } from "@/i18n/navigation";
import { generateSocketInstance } from "@/lib/utils";
import { decodeToken } from "@/middleware";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

function OAuth() {
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");
  const router = useRouter();
  const count = useRef(0);
  const { mutateAsync } = useSetTokenToCookieMutation();

  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role);
            setSocket(generateSocketInstance(accessToken));
            router.push("/manage/dashboard");
          })
          .catch((e) => toast.error(e || "Có lỗi xảy ra!"));
        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast.error(message || "Có lỗi xảy ra!");
        });
      }
      count.current++;
    }
  }, [
    accessToken,
    refreshToken,
    setRole,
    setSocket,
    router,
    message,
    mutateAsync,
  ]);

  return null;
}

export default function OAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuth />
    </Suspense>
  );
}
