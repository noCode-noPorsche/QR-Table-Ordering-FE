/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import RefreshToken from "@/components/refresh-token";
import { Role } from "@/constants/type";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useContext, useEffect, useState, createContext } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const AppContext = createContext<{
  isAuth: boolean;
  role: RoleType | undefined;

  setRole: (role?: RoleType | undefined) => void;
}>({
  isAuth: false,
  role: Role.Employee,
  setRole: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRoleState] = useState<RoleType | undefined>();

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const role = decodeToken(accessToken).role;
      setRoleState(role);
    }
  }, []);

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokensFromLocalStorage();
    }
  };

  const isAuth = Boolean(role);

  return (
    <AppContext
      value={{
        role,
        setRole,
        isAuth,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AppContext>
  );
}
