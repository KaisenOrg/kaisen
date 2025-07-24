import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useActor } from "@/lib/agent";
import { toUserData } from "@/lib/mappers";
import { useUserStore } from "@/stores/useUserStore";
import { createContext, useEffect } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, identity } = useAuth();
  const { setUser } = useUserStore();
  const { user } = useUser();

  const usersActor = useActor("users_backend");

  useEffect(() => {
    if (isAuthenticated && !user && usersActor) {
      usersActor?.getUser(identity!.getPrincipal().toText()).then((result) => {
        if ("ok" in result) {
          setUser(toUserData(result.ok));
        }
      });
    }
  }, [usersActor, isAuthenticated, user]);

  return <UserContext.Provider value={null}>{children}</UserContext.Provider>;
}