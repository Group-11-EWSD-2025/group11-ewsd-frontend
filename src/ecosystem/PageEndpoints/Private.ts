import Loadable from "@/components/common/Loadable";
import { lazy } from "react";

export type PageEndpoint = {
  path: string;
  pattern: string;
  label: string;
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
    pattern: "^/$",
    label: "Home",
    component: Loadable(lazy(() => import("@/modules/Home"))),
  },
  departments: {
    notFound: {
      path: "/departments/not-found",
      pattern: "^/departments/not-found$",
      label: "No Departments",
      component: Loadable(lazy(() => import("@/modules/Departments/NotFound"))),
    },
    details: {
      root: {
        path: "/departments/:id",
        pattern: "^/departments/\\d+$",
        label: "Idea Listing",
        component: Loadable(
          lazy(() => import("@/modules/Departments/details")),
        ),
      },
      settings: {
        path: "/departments/:id/settings",
        pattern: "^/departments/\\d+/settings$",
        label: "Department Settings",
        component: Loadable(
          lazy(() => import("@/modules/Departments/details/Settings")),
        ),
      },
      ideaDetails: {
        path: "/departments/:id/ideas/:ideaId",
        pattern: "^/departments/\\d+/ideas/\\d+$",
        label: "Idea Details",
        component: Loadable(lazy(() => import("@/modules/Ideas/details"))),
      },
    },
  },
  categories: {
    path: "/categories",
    pattern: "^/categories$",
    label: "Categories",
    component: Loadable(lazy(() => import("@/modules/Categories"))),
  },
  insights: {
    path: "/insights",
    pattern: "/insights",
    label: "Insights",
    component: Loadable(lazy(() => import("@/modules/Insights"))),
  },
  users: {
    path: "/users",
    pattern: "/users",
    label: "Users",
    component: Loadable(lazy(() => import("@/modules/Users"))),
  },
  accountSettings: {
    path: "/account-settings",
    pattern: "/account-settings",
    label: "Account Settings",
    component: Loadable(lazy(() => import("@/modules/AccountSettings"))),
  },
} as const satisfies RouteStructure;

// Infer the type from the object
export type PrivatePageEndPointsType = typeof PrivatePageEndPoints;
