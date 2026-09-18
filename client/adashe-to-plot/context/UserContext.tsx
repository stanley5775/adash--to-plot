"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: "CUSTOMER" | "ADMIN";
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/users/me`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!res.ok) {
          setUserState(null);
          return;
        }

        const result = await res.json();

        if (result.success) {
          setUserState(result.data);
        } else {
          setUserState(null);
        }
      } catch (error) {
        console.error("FETCH ME ERROR:", error);
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUserState(null);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        logout,
      }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
}
