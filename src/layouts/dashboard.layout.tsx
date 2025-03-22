import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

function DashboardLayout() {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const widthFullRoutes = ["/users", "/categories"];
  const isWidthFull = widthFullRoutes.includes(pathname);

  return (
    <div className="bg-muted flex">
      <div
        className={cn(
          "border-border-weak fixed top-0 left-0 z-10 w-[var(--sidebar-width)] translate-x-[-100%] border-r bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen && "translate-x-0",
        )}
      >
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      <div className="ml-0 w-full lg:ml-[var(--sidebar-width)] lg:w-[calc(100vw-var(--sidebar-width))]">
        <Topbar setIsSidebarOpen={setIsSidebarOpen} />
        <div className="overflow-y-auto lg:h-[calc(100vh-var(--topbar-height))]">
          <div
            className={cn(
              "mx-auto h-full",
              !isWidthFull && "lg:max-w-[var(--content-width)]",
              isWidthFull && "w-full px-5 py-6",
            )}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
