import { useAuth } from "@/context/AuthContext";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { ChartLine, Tags, Users } from "lucide-react";

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

export const FEATURES = {
  ACADEMIC_YEAR_SETTING: "ACADEMIC_YEAR_SETTING",
  EXPORT_DATA: "EXPORT_DATA",
} as const;

type NavItem = (typeof MAIN_NAV_ITEMS)[keyof typeof MAIN_NAV_ITEMS];
type Feature = (typeof FEATURES)[keyof typeof FEATURES];
export const ROLES = [
  {
    value: "admin",
    label: "Admin",
    description: "Admin role",
    navItems: [MAIN_NAV_ITEMS.INSIGHTS, MAIN_NAV_ITEMS.USERS],
    features: [
      FEATURES.ACADEMIC_YEAR_SETTING,
      FEATURES.EXPORT_DATA,
    ] as Feature[],
  },
  {
    value: "qa-manager",
    label: "QA Manager",
    description: "QA Manager role",
    navItems: [
      MAIN_NAV_ITEMS.CATEGORIES,
      MAIN_NAV_ITEMS.INSIGHTS,
      MAIN_NAV_ITEMS.USERS,
    ],
    features: [FEATURES.EXPORT_DATA] as Feature[],
  },
  {
    value: "qa-coordinator",
    label: "QA Coordinator",
    description: "QA Coordinator role",
    navItems: [MAIN_NAV_ITEMS.INSIGHTS] as NavItem[],
    features: [FEATURES.EXPORT_DATA] as Feature[],
  },
  {
    value: "staff",
    label: "Staff",
    description: "Staff role",
    navItems: [MAIN_NAV_ITEMS.INSIGHTS] as NavItem[],
    features: [] as Feature[],
  },
];

export const useAuthorize = () => {
  const { authState } = useAuth();
  const role = authState?.userData?.role;

  const roleNavItems = ROLES.find((r) => r.value === role)?.navItems;

  const checkFeatureAvailability = (feature: Feature) => {
    const userRole = ROLES.find((r) => r.value === role);
    return userRole?.features?.includes(feature);
  };

  return {
    roleNavItems,
    checkFeatureAvailability,
  };
};
