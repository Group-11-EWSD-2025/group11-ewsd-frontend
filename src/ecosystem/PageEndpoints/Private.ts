import Loadable from "@/components/common/Loadable";
import { lazy } from "react";

export const PrivatePageEndPoints = {
  root: {
    path: "/",
    label: "Home",
    getHref: () => "/",
    component: Loadable(lazy(() => import("@/modules/Home"))),
  },
  categories: {
    path: "/categories",
    label: "Categories",
    getHref: () => "/categories",
    component: Loadable(lazy(() => import("@/modules/Categories"))),
  },
  insights: {
    path: "/insights",
    label: "Insights",
    getHref: () => "/insights",
    component: Loadable(lazy(() => import("@/modules/Insights"))),
  },
  users: {
    path: "/users",
    label: "Users",
    getHref: () => "/users",
    component: Loadable(lazy(() => import("@/modules/Users"))),
  },
  accountSettings: {
    path: "/account-settings",
    label: "Account Settings",
    getHref: () => "/account-settings",
    component: Loadable(lazy(() => import("@/modules/AccountSettings"))),
  },
};
