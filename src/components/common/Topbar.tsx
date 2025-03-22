import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { Bell, ChevronLeft, Menu, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type Props = {
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

const Topbar = ({ setIsSidebarOpen }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  // TODO: This is a temporary solution to get the details id
  const getDetailsId = () => {
    const parts = pathname.split("/");
    return parts[2];
  };
  const detailsId = getDetailsId();

  const getAllDirectEndpoints = Object.values(PrivatePageEndPoints)
    .map((endpoint: any) => {
      return !!endpoint.path ? endpoint : null;
    })
    .filter(Boolean);

  const header = (): string => {
    // TODO: Add more endpoints to the mapper
    const headerMapper = {
      [PrivatePageEndPoints.departments.details.root.path.replace(
        ":id",
        detailsId ?? "",
      )]: "Departments",
      [PrivatePageEndPoints.departments.details.settings.path.replace(
        ":id",
        detailsId ?? "",
      )]: "Department Settings",
      DEFAULT: getAllDirectEndpoints.find(
        (endpoint) => endpoint.path === pathname,
      )?.label,
    };

    return (
      headerMapper[pathname as keyof typeof headerMapper] ??
      headerMapper.DEFAULT
    );
  };

  const isDepartmentDetailsRoute = () => {
    const detailsPath =
      PrivatePageEndPoints.departments.details.root.path.replace(
        ":id",
        detailsId ?? "",
      );
    return pathname === detailsPath;
  };

  const isShowBackButton = () => {
    const showBackBtnRoutes = [
      PrivatePageEndPoints.departments.details.settings.path.replace(
        ":id",
        detailsId ?? "",
      ),
    ];
    const showBackButton = showBackBtnRoutes.includes(pathname);
    return showBackButton;
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
          {isShowBackButton() && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigate(-1);
              }}
            >
              <ChevronLeft size={20} />
            </Button>
          )}
          <h1 className="text-xl font-medium">{header()}</h1>
        </div>
        <div className="flex items-center gap-x-7">
          {isDepartmentDetailsRoute() && (
            <Link
              to={`${PrivatePageEndPoints.departments.details.settings.path.replace(
                ":id",
                detailsId ?? "",
              )}`}
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
              to={`${PrivatePageEndPoints.departments.details.settings.path.replace(
                ":id",
                detailsId ?? "",
              )}`}
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
      </div>
    </>
  );
};

export default Topbar;
