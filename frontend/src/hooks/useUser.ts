import { useActor } from "@/lib/agent";
import { toMotokoUser, toUserData } from "@/lib/mappers";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/stores/useUserStore";
import type { UserData } from "@/types";

export function useUser() {
  const userActor = useActor("users_backend");
  const { user, setUser, clearUser, setError, error, isLoading, setLoading } = useUserStore();
  const { principal } = useAuth();

  const register = async (data: {
    username: string;
    nickname: string;
    about?: string;
    role?: string;
  }) => {
    if (!userActor || !principal) return;

    setLoading(true);
    setError(null);

    const newUser = {
      nickname: data.nickname,
      username: data.username,
      picture: null,
      about: data.about ?? null,
      role: data.role ?? null,
      followers: [],
      following: [],
      certificates: [],
      createdTracks: [],
      inProgressTracks: [],
      completedTracks: [],
      principal: principal,
      identity: principal.toText(),
    };

    await userActor.createUser(toMotokoUser(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const fetchUser = async () => {
    if (!userActor || !principal) return;

    setError(null);
    setLoading(true);

    const result = await userActor.getUser(principal.toText());
    if ("ok" in result) {
      setUser(toUserData(result.ok));
    } else {
      clearUser();
    }

    setLoading(false);
  };

  const update = async (newData: UserData) => {
    if (!userActor) return;

    setError(null);
    setLoading(true);

    try {
      await userActor.updateUser(toMotokoUser(newData));
      setUser(newData);
    } catch (e) {
      console.error(e);
      setError("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return { user, register, fetchUser, update, clearUser, error, isLoading };
}
