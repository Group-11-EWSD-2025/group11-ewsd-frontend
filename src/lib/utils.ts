import { loginState } from "@/recoil/auth";
import { dialogState } from "@/recoil/common";
import { getRecoil, resetRecoil, setRecoil } from "@/recoil/recoil-portal";
import { TUserData } from "@/types";
import { Dialog } from "@/types/common";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// dialog state
export function showDialog(dialog: Dialog) {
  setRecoil(dialogState, dialog);
}
export function hideDialog() {
  resetRecoil(dialogState);
}

// login state
export function setLoginState(data: { token: string; userData: TUserData }) {
  setRecoil(loginState, data);
}
export function getLoginState() {
  return getRecoil(loginState);
}
export function clearLoginState() {
  resetRecoil(loginState);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("");
}
