import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DEPARTMENTS } from "@/constants";
import {
  PageEndpoint,
  PrivatePageEndPoints,
} from "@/ecosystem/PageEndpoints/Private";
import { Bell, ChevronLeft, Menu, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

const Topbar = ({ setIsSidebarOpen }: Props) => {
  const location = useLocation();
  const pathname = location.pathname;

  const getDepartmentId = () => {
    const parts = pathname.split("/");
    return parts[1] === "departments" ? parts[2] : null;
  };

  const departmentId = getDepartmentId();
  const department = DEPARTMENTS.find((d) => d.id === departmentId);

  const header = (): string => {
    const extractRoutes = (
      obj: any,
    ): Array<{ path: string; label: string }> => {
      return Object.values(obj).reduce(
        (acc: Array<{ path: string; label: string }>, value) => {
          if (!value || typeof value !== "object") return acc;

          // Type guard for PageEndpoint
          const isPageEndpoint = (v: any): v is PageEndpoint =>
            typeof v === "object" &&
            "path" in v &&
            "label" in v &&
            "getHref" in v &&
            "component" in v;

          if (isPageEndpoint(value)) acc.push(value);
          return [...acc, ...extractRoutes(value)];
        },
        [],
      );
    };

    const findRoute = (routes: Array<{ path: string; label: string }>) => {
      for (const route of routes) {
        const pattern = route.path
          .replace(/:\w+/g, "([^/]+)")
          .replace(/^\//, "^/")
          .replace(/$/, "/?$");

        const matches = pathname.match(new RegExp(pattern));
        if (matches) {
          const pathParts = route.path.split("/").filter(Boolean);
          const isDynamicRoot =
            pathParts.length === 2 && pathParts[1].startsWith(":");

          return isDynamicRoot ? matches[1] : route.label;
        }
      }
      return "";
    };

    return findRoute(extractRoutes(PrivatePageEndPoints));
  };

  const isDepartmentDetailsRoute = () => {
    const detailsPath =
      PrivatePageEndPoints.departments.details.root.path.replace(
        ":id",
        departmentId ?? "",
      );
    return pathname === detailsPath;
  };

  const isDepartmentSettingsRoute = () => {
    const detailsPath =
      PrivatePageEndPoints.departments.details.settings.path.replace(
        ":id",
        departmentId ?? "",
      );
    return pathname === detailsPath;
  };

  return (
    <>
      <div
        className="z-10 hidden h-[var(--topbar-height)] items-center justify-between px-5 lg:flex"
        style={{
          background: "linear-gradient(180deg, #F3F4F6 0%, #FFFFFF 100%)",
        }}
      >
        <div className="flex items-center gap-x-4">
          {isDepartmentSettingsRoute() && (
            <Link
              to={PrivatePageEndPoints.departments.details.root.getHref(
                departmentId ?? "",
              )}
            >
              <ChevronLeft size={20} />
            </Link>
          )}
          <h1 className="text-xl font-medium">{header()}</h1>
        </div>
        <div className="flex items-center gap-x-7">
          {isDepartmentDetailsRoute() && (
            <Link
              to={PrivatePageEndPoints.departments.details.settings.getHref(
                departmentId ?? "",
              )}
              className="hover:bg-foreground/5 flex cursor-pointer items-center gap-x-2 rounded-md p-2 transition-colors duration-200"
            >
              <Settings size={20} />
              <p>Department Settings</p>
            </Link>
          )}
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div
        className="px-4 py-2 lg:hidden"
        style={{
          background: "linear-gradient(180deg, #F3F4F6 0%, #FFFFFF 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <Menu
            size={20}
            className="cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          />
          <div className="flex items-center gap-x-4">
            <Link
              to={PrivatePageEndPoints.departments.details.settings.getHref(
                departmentId ?? "",
              )}
              className="hover:bg-foreground/5 flex cursor-pointer items-center gap-x-2 rounded-md p-2 transition-colors duration-200"
            >
              <Settings size={20} />
            </Link>
            <Bell size={20} />
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        {department && (
          <h1 className="py-2 text-lg font-medium">{department?.name}</h1>
        )}
      </div>
    </>
  );
};

export default Topbar;
