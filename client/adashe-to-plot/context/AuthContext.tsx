"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "./UserContext";

type Role = "CUSTOMER" | "ADMIN";

type AuthContextType = {
  isAuthorized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: Role[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setIsAuthorized(false);
      router.replace(`/login`);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      setIsAuthorized(false);

      if (user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }

      return;
    }

    setIsAuthorized(true);
  }, [user, loading, allowedRoles, pathname, router]);

  if (loading || !isAuthorized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
