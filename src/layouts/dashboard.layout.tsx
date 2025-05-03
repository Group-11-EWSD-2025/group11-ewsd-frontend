import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useStorePageView } from "./api/mutateStorePageView";

function getPageLabel(pathname: string, routes: any): string | undefined {
  if (pathname === "/") {
    return routes.root.label;
  }
  const segments = pathname.split("/").filter(Boolean);
  let current = routes;
  for (const segment of segments) {
    if (current[segment]?.label) {
      return current[segment].label;
    }

    if (current[segment]?.details) {
      current = current[segment].details;
      continue;
    }

    for (const key of Object.keys(current)) {
      const route = current[key];
      if (route?.pattern && new RegExp(route.pattern).test(pathname)) {
        return route.label;
      }
    }
    return undefined;
  }
  return undefined;
}

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const { mutate: storePageView } = useStorePageView({});
  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    const label = getPageLabel(location.pathname, PrivatePageEndPoints);

    if (label && previousPathname.current !== location.pathname) {
      storePageView(label);
      previousPathname.current = location.pathname;
    }
  }, [location, storePageView]);

  return (
    <div className="bg-muted flex min-h-screen">
      <div
        className={cn(
          "border-border-weak fixed top-0 left-0 z-20 w-[var(--sidebar-width)] translate-x-[-100%] border-r bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen && "translate-x-0",
        )}
      >
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      <div className="ml-0 w-full lg:ml-[var(--sidebar-width)] lg:w-[calc(100%-var(--sidebar-width))]">
        <Topbar setIsSidebarOpen={setIsSidebarOpen} />
        <div className="overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
