import Loadable from "@/components/common/Loadable";
import { lazy } from "react";

export const PublicPageEndPoints = {
  login: {
    path: "/login",
    pattern: "^/login$",
    label: "Login",
    component: Loadable(lazy(() => import("@/modules/Auth/Login"))),
  },
  resetPassword: {
    path: "/reset-password",
    label: "Reset Password",
    component: Loadable(lazy(() => import("@/modules/Auth/ResetPassword"))),
  },
};
