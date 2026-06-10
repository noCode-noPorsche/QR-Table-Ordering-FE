import { useAppStore } from "@/src/components/app-provider";
import { handleErrorApi } from "@/src/lib/utils";
import { useLogoutMutation } from "@/src/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UNAUTHORIZED_PATHS = ["/login", "/logout", "/refresh-token", "/register"];

export default function ListenLogoutSocket() {
  const pathname = usePathname();
  const router = useRouter();
  const setRole = useAppStore((state) => state.setRole);
  const socket = useAppStore((state) => state.socket);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);

  const { mutateAsync, isPending } = useLogoutMutation();

  useEffect(() => {
    if (UNAUTHORIZED_PATHS.some((p) => pathname.startsWith(p))) {
      return;
    }
    async function onLogout() {
      if (isPending) return;
      try {
        await mutateAsync();
        setRole(undefined);
        disconnectSocket();
        router.push("/");
      } catch (error) {
        handleErrorApi({ error });
      }
    }
    socket?.on("logout", onLogout);
    return () => {
      socket?.off("logout", onLogout);
    };
  }, [
    router,
    setRole,
    socket,
    disconnectSocket,
    isPending,
    mutateAsync,
    pathname,
  ]);

  return null;
}
