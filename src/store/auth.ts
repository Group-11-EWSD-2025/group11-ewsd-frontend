import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface LoginState {
  isAuthenticated: boolean;
  token: string | null;
}

export const loginState = atom<LoginState>({
  key: "loginState",
  default: {
    isAuthenticated: false,
    token: null,
  },
  effects_UNSTABLE: [persistAtom],
}); 