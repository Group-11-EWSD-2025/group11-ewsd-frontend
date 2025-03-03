import { TUserData } from "@/types";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const loginState = atom<{
  token: string;
  userData: TUserData;
}>({
  key: "loginState",
  default: {
    token: "",
    userData: {
      email: "",
    },
  },
  effects_UNSTABLE: [persistAtom],
});
