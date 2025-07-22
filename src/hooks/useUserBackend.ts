import { useActor } from "@/lib/agent";
import { useUserStore } from "@/store/useUserStore";
import { toMotokoUser, toUserData } from "@/lib/utils";
import { useAuth } from "./useAuth";
import { UserData } from "@/types";

export function useUserBackend() {
  const userActor = useActor("users_backend");
  const { setUser, clearUser } = useUserStore();
  const { principal, identity } = useAuth();

  const register = async (data: {
    username: string;
    nickname: string;
    about?: string;
    role?: string;
  }) => {
    if (!userActor) return;

    if (!principal) return;

    const user = {
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

    await userActor.createUser(toMotokoUser(user));
    setUser(user);
  };

  const fetchUser = async () => {
    if (!userActor) return;

    console.log(`Principal: ${principal?.toText()}\nIdentity: ${identity?.getPrincipal().toText()}`);

    const identityText = principal!.toText();
    const result = await userActor.getUser(identityText);
    if ("ok" in result) {
      setUser(toUserData(result.ok));
    } else {
      clearUser();
    }
  };

  const update = async (newData: UserData) => {
    if (!userActor) return;
    if (!principal) return;

    await userActor.updateUser(toMotokoUser(newData));
    setUser(newData);
  };


  return { register, fetchUser, update };
}
