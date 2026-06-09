"use client";

import { useAppContext } from "@/components/app-provider";
import { generateSocketInstance } from "@/lib/utils";
import { decodeToken } from "@/middleware";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function OAuthPage() {
  const { setRole, setSocket } = useAppContext();
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
