import Loadable from "@/components/common/Loadable";
import { lazy } from "react";

export const PublicPageEndPoints = {
  welcome: {
    path: "/welcome",
    label: "Welcome",
    getHref: () => "/welcome",
    component: Loadable(lazy(() => import("@/modules/Auth/Welcome"))),
  },
  login: {
    path: "/login",
    label: "Login",
    getHref: (redirectTo?: string | null | undefined) =>
      `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    component: Loadable(lazy(() => import("@/modules/Auth/Login"))),
  },
  register: {
    path: "/register",
    label: "Register",
    getHref: () => "/register",
    component: Loadable(lazy(() => import("@/modules/Auth/Register"))),
  },
  accountType: {
    path: "/account-type",
    label: "Account Type",
    getHref: () => "/account-type",
    component: Loadable(lazy(() => import("@/modules/Auth/AccountType"))),
  },
  // for testing purposes only we will try with storybook later
  testComponents: {
    path: "/test-components",
    label: "Test Components",
    getHref: () => "/test-components",
    component: Loadable(lazy(() => import("@/modules/TestComponents"))),
  },
  redirect: {
    path: "/redirect",
    label: "Redirect",
    getHref: () => "/redirect",
    component: Loadable(lazy(() => import("@/modules/Redirect"))),
  },
};
