"use client";

import ListenLogoutSocket from "@/components/listen-logout-socket";
import RefreshToken from "@/components/refresh-token";
import {
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { decodeToken } from "@/middleware";
import { RoleType } from "@/types/jwt.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { create } from "zustand";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

type AppStoreType = {
  isAuth: boolean;
  role: RoleType | undefined;
  setRole: (role?: RoleType | undefined) => void;
  socket: Socket | undefined;
  setSocket: (socket?: Socket | undefined) => void;
  disconnectSocket: () => void;
};

export const useAppStore = create<AppStoreType>((set) => ({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role, isAuth: Boolean(role) });
    if (!role) {
      removeTokensFromLocalStorage();
    }
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => set({ socket }),
  disconnectSocket: () =>
    set((state) => {
      state.socket?.disconnect();
      return { socket: undefined };
    }),
}));

// const AppContext = createContext<{
//   isAuth: boolean;
//   role: RoleType | undefined;
//   setRole: (role?: RoleType | undefined) => void;
//   socket: Socket | undefined;
//   setSocket: (socket?: Socket | undefined) => void;
//   disconnectSocket: () => void;
// }>({
//   isAuth: false,
//   role: Role.Employee,
//   setRole: () => {},
//   socket: undefined,
//   setSocket: () => {},
//   disconnectSocket: () => {},
// });

// export const useAppContext = () => {
//   return useContext(AppContext);
// };

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [role, setRoleState] = useState<RoleType | undefined>();
  // const [socket, setSocket] = useState<Socket | undefined>();
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const count = useRef(0);

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        const role = decodeToken(accessToken).role;
        setRole(role);
        setSocket(generateSocketInstance(accessToken));
      }
    }
    count.current++;
  }, [setRole, setSocket]);

  // const disconnectSocket = () => {
  //   socket?.disconnect();
  //   setSocket(undefined);
  // };

  // const setRole = (role?: RoleType | undefined) => {
  //   setRoleState(role);
  //   if (!role) {
  //     removeTokensFromLocalStorage();
  //   }
  // };

  // const isAuth = Boolean(role);

  return (
    // <AppContext
    //   value={{
    //     role,
    //     setRole,
    //     isAuth,
    //     socket,
    //     setSocket,
    //     disconnectSocket,
    //   }}
    // >
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools />
    </QueryClientProvider>
    // </AppContext>
  );
}
