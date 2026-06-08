import { useAppContext } from "@/components/app-provider";
import { handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UNAUTHORIZED_PATHS = ["/login", "/logout", "/refresh-token", "/register"];

export default function ListenLogoutSocket() {
  const pathname = usePathname();
  const router = useRouter();
  const { socket, disconnectSocket, setRole } = useAppContext();
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
