import Sidebar from "@/components/common/Sidebar";
import Topbar from "@/components/common/Topbar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#F3F4F6]">
      <Sidebar />
      <div className="w-[calc(100vw-256px)] flex-1">
        <Topbar />
        <div className="mx-auto h-[calc(100vh-64px)] max-w-[728px] overflow-y-auto py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
