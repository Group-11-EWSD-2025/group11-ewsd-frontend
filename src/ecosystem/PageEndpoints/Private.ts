import Loadable from "@/components/common/Loadable";
import { lazy } from "react";

export const PrivatePageEndPoints = {
  root: {
    path: "/",
    label: "Home",
    getHref: () => "/",
    component: Loadable(lazy(() => import("@/modules/Home"))),
  },
};
