"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getUserId, getUserName } from "@/lib/user";
import { identifyUser } from "@/app/actions";

interface UserContextType {
  userId: string | null;
  userName: string | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  userId: null,
  userName: null,
  isLoading: true,
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const id = getUserId();
        setUserId(id);

        const name = getUserName();
        setUserName(name);
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        await identifyUser(id, name ?? undefined, tz);
      } catch (error) {
        console.error("Failed to initialize user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, []);

  return (
    <UserContext.Provider value={{ userId, userName, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
