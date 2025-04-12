import { TLoginState } from "@/types";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const loginState = atom<TLoginState>({
  key: "loginState",
  default: {
    token: "",
    userData: {
      id: "",
      name: "",
      email: "",
      role: "",
      phone: "",
      profile: null,
    },
  },
  effects_UNSTABLE: [persistAtom],
});
