import Loadable from "@/components/common/Loadable";
import { lazy } from "react";

export const PublicPageEndPoints = {
  login: {
    path: "/login",
    label: "Login",
    component: Loadable(lazy(() => import("@/modules/Auth/Login"))),
  },
};
