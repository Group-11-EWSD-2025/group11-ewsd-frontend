import Loadable from "@/components/common/Loadable";
import { lazy } from "react";

export type PageEndpoint = {
  path: string;
  label: string;
  getHref: (() => string) | ((param: string) => string);
  component: any;
};

type RouteStructure = {
  [K: string]:
    | PageEndpoint
    | {
        [K: string]: PageEndpoint | RouteStructure;
      };
};

// Create a type that will be inferred from the actual object
export const PrivatePageEndPoints = {
  root: {
    path: "/",
    label: "Home",
    getHref: () => "/",
    component: Loadable(lazy(() => import("@/modules/Home"))),
  },
  departments: {
    notFound: {
      path: "/departments/not-found",
      label: "No Departments",
      getHref: () => "/departments/not-found",
      component: Loadable(lazy(() => import("@/modules/Departments/NotFound"))),
    },
    details: {
      root: {
        path: "/departments/:id",
        label: "Department Details",
        getHref: (id: string) => `/departments/${id}`,
        component: Loadable(
          lazy(() => import("@/modules/Departments/details")),
        ),
      },
      settings: {
        path: "/departments/:id/settings",
        label: "Department Settings",
        getHref: (id: string) => `/departments/${id}/settings`,
        component: Loadable(
          lazy(() => import("@/modules/Departments/details/Settings")),
        ),
      },
    },
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
} as const satisfies RouteStructure;

// Infer the type from the object
export type PrivatePageEndPointsType = typeof PrivatePageEndPoints;
