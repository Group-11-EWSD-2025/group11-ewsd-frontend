import { useAuth } from "@/context/AuthContext";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { flattenRoutes } from "@/lib/utils";
import { ChartLine, Tags, Users } from "lucide-react";

export const FEATURES = {
  ACADEMIC_YEAR_SETTING: "ACADEMIC_YEAR_SETTING",
  EXPORT_DATA: "EXPORT_DATA",
  CREATE_DEPARTMENT: "CREATE_DEPARTMENT",
  CREATE_IDEA: "CREATE_IDEA",
  DEPARTMENT_SETTING: "DEPARTMENT_SETTING",
  USER_CRUD: "USER_CRUD",
  REACT_COMMENT_IDEA: "REACT_COMMENT_IDEA",
  REPORT_IDEA: "REPORT_IDEA",
  TOGGLE_HIDE_AND_SEE_REPORT_IDEA: "TOGGLE_HIDE_AND_SEE_REPORT_IDEA",
} as const;

const MAIN_NAV_ITEMS = {
  CATEGORIES: {
    icon: <Tags size={20} />,
    label: "Categories",
    href: PrivatePageEndPoints.categories.path,
  },
  INSIGHTS: {
    icon: <ChartLine size={20} />,
    label: "Insights",
    href: PrivatePageEndPoints.insights.path,
  },
  USERS: {
    icon: <Users size={20} />,
    label: "Users Management",
    href: PrivatePageEndPoints.users.path,
  },
} as const;

type Feature = (typeof FEATURES)[keyof typeof FEATURES];

interface Role {
  value: string;
  label: string;
  description: string;
  features: Feature[];
  authorizedEndpoints: string[];
}

const excludedRoutes = (excludePaths: string[]) => {
  return flattenRoutes(PrivatePageEndPoints).filter(
    (route) => !excludePaths.some((path) => route.path.includes(path)),
  );
};

export const ROLES: Role[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Admin role",
    features: [
      FEATURES.ACADEMIC_YEAR_SETTING,
      FEATURES.EXPORT_DATA,
      FEATURES.CREATE_DEPARTMENT,
      FEATURES.DEPARTMENT_SETTING,
      FEATURES.USER_CRUD,
    ],
    authorizedEndpoints: excludedRoutes([
      PrivatePageEndPoints.categories.path,
    ]).map((route) => route.path),
  },
  {
    value: "qa-manager",
    label: "QA Manager",
    description: "QA Manager role",
    features: [FEATURES.EXPORT_DATA, FEATURES.TOGGLE_HIDE_AND_SEE_REPORT_IDEA],
    authorizedEndpoints: excludedRoutes([]).map((route) => route.path),
  },
  {
    value: "qa-coordinator",
    label: "QA Coordinator",
    description: "QA Coordinator role",
    features: [FEATURES.EXPORT_DATA],
    authorizedEndpoints: excludedRoutes([
      PrivatePageEndPoints.departments.details.settings.path,
      PrivatePageEndPoints.categories.path,
      PrivatePageEndPoints.users.path,
    ]).map((route) => route.path),
  },
  {
    value: "staff",
    label: "Staff",
    description: "Staff role",
    features: [FEATURES.CREATE_IDEA, FEATURES.REACT_COMMENT_IDEA],
    authorizedEndpoints: excludedRoutes([
      PrivatePageEndPoints.categories.path,
      PrivatePageEndPoints.insights.path,
      PrivatePageEndPoints.users.path,
      PrivatePageEndPoints.departments.details.settings.path,
    ]).map((route) => route.path),
  },
];

const getAllRoutePatterns = (endpoints: ReturnType<typeof flattenRoutes>) => {
  const patterns: Array<{ path: string; pattern: string }> = [];

  endpoints.forEach((route) => {
    if (route.path && route.pattern) {
      patterns.push({
        path: route.path,
        pattern: route.pattern,
      });
    }
  });

  return patterns;
};

export const useAuthorize = () => {
  const { authState } = useAuth();
  const role = authState?.userData?.role;
  const currentRole = ROLES.find((r) => r.value === role);

  const checkEndpointAvailability = (pathname: string): boolean => {
    const authorizedEndpoints = currentRole?.authorizedEndpoints;
    if (!authorizedEndpoints?.length) return false;

    const flattenedRoutes = flattenRoutes(PrivatePageEndPoints);
    const allPatterns = getAllRoutePatterns(flattenedRoutes);

    return authorizedEndpoints.some((authorizedPath) => {
      if (authorizedPath === pathname) return true;

      const routeConfig = allPatterns.find((route) => {
        if (route.path !== authorizedPath) return false;

        try {
          return new RegExp(route.pattern).test(pathname);
        } catch (error) {
          console.error(`Invalid pattern for path ${authorizedPath}:`, error);
          return false;
        }
      });

      return !!routeConfig;
    });
  };

  const checkFeatureAvailability = (feature: Feature): boolean => {
    return Boolean(currentRole?.features?.includes(feature));
  };

  const roleNavItems = () => {
    return Object.values(MAIN_NAV_ITEMS).filter((route) =>
      checkEndpointAvailability(route.href),
    );
  };

  return {
    roleNavItems: roleNavItems(),
    checkEndpointAvailability,
    checkFeatureAvailability,
  };
};
