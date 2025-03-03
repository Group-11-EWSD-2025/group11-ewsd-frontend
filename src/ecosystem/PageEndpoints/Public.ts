import Loadable from "@/components/common/Loadable";
import { lazy } from "react";

export const PublicPageEndPoints = {
  login: {
    path: "/login",
    label: "Login",
    getHref: (redirectTo?: string | null | undefined) =>
      `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    component: Loadable(lazy(() => import("@/modules/Auth/Login"))),
  },
};
