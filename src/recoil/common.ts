import { Dialog } from "@/types/common";
import { atom } from "recoil";

export const dialogState = atom<Dialog | undefined>({
  key: "DIALOG_CENTER",
  default: undefined,
});
