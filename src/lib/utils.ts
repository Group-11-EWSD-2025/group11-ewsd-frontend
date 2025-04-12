import { loginState } from "@/recoil/auth";
import { dialogState } from "@/recoil/common";
import { getRecoil, resetRecoil, setRecoil } from "@/recoil/recoil-portal";
import { TUserData } from "@/types";
import { Dialog, Endpoints, Route } from "@/types/common";
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
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].charAt(0);
  return words[0].charAt(0) + words[words.length - 1].charAt(0);
}

export const isRoute = (route: unknown): route is Route => {
  return (
    typeof route === "object" &&
    route !== null &&
    "path" in route &&
    "component" in route
  );
};

export const flattenRoutes = (endpoints: Endpoints): Route[] => {
  return Object.values(endpoints).flatMap((route) =>
    isRoute(route) ? [route] : flattenRoutes(route as Endpoints),
  );
};
