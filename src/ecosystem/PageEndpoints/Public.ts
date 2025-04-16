import Loadable from "@/components/common/Loadable";
import { lazy } from "react";

export const PublicPageEndPoints = {
  login: {
    root: {
      path: "/login",
      pattern: "^/login$",
      label: "Login",
      component: Loadable(lazy(() => import("@/modules/Auth/Login"))),
    },
  },
  resetPassword: {
    root: {
      path: "/reset-password",
      pattern: "^/reset-password$",
      label: "Reset Password",
      component: Loadable(lazy(() => import("@/modules/Auth/ResetPassword"))),
    },
  },
};
