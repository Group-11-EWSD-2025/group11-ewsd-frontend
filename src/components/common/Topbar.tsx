import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { FEATURES, useAuthorize } from "@/hooks/useAuthorize";
import { getInitials } from "@/lib/utils";
import { useGetDepartmentDetails } from "@/modules/Departments/api/queryGetDepartmentDetails";
import { ChevronLeft, Menu, Settings } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

type Props = {
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

const Topbar = ({ setIsSidebarOpen }: Props) => {
  const { id, ideaId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { checkFeatureAvailability } = useAuthorize();
  const { authState } = useAuth();
  const pathname = location.pathname;

  const getDepartmentDetails = useGetDepartmentDetails({
    queryConfig: {
      enabled: !!id,
    },
    data: { id: id as string },
  });

  const departmentData = getDepartmentDetails.data?.data.body;

  const getAllDirectEndpoints = Object.values(PrivatePageEndPoints)
    .map((endpoint: any) => {
      return !!endpoint.path ? endpoint : null;
    })
    .filter(Boolean);

  const header = (): React.ReactNode => {
    const headerMapper = {
      [PrivatePageEndPoints.departments.details.root.path.replace(
        ":id",
        id ?? "",
      )]: (
        <div className="flex items-center gap-x-2">
          <p>{departmentData?.name}</p>
          <div className="bg-ring size-1.5 rounded-full"></div>
          <p className="text-ring">{departmentData?.idea_count} Ideas</p>
        </div>
      ),
      [PrivatePageEndPoints.departments.details.settings.path.replace(
        ":id",
        id ?? "",
      )]: "Department Settings",
      [PrivatePageEndPoints.departments.details.ideaDetails.path
        .replace(":id", id ?? "")
        .replace(":ideaId", ideaId ?? "")]: (
        <div className="flex items-center gap-x-2">
          <Button variant="ghost" size="icon">
            <Link
              to={`${PrivatePageEndPoints.departments.details.root.path.replace(
                ":id",
                id ?? "",
              )}`}
            >
              <ChevronLeft size={20} />
            </Link>
          </Button>
          <p>Replying on Idea</p>
        </div>
      ),
      DEFAULT: getAllDirectEndpoints.find(
        (endpoint) => endpoint.path === pathname,
      )?.label,
    };

    if (getDepartmentDetails.isLoading) {
      return <Skeleton className="bg-input h-8 w-40" />;
    }

    return (
      headerMapper[pathname as keyof typeof headerMapper] ??
      headerMapper.DEFAULT
    );
  };

  const isDepartmentDetailsRoute = () => {
    const detailsPath =
      PrivatePageEndPoints.departments.details.root.path.replace(
        ":id",
        id ?? "",
      );
    return pathname === detailsPath;
  };

  const isShowBackButton = () => {
    const showBackBtnRoutes = [
      PrivatePageEndPoints.departments.details.settings.path.replace(
        ":id",
        id ?? "",
      ),
    ];
    const showBackButton = showBackBtnRoutes.includes(pathname);
    return showBackButton;
  };

  return (
    <>
      <div
        className="sticky top-0 z-10 hidden w-[calc(100vw-var(--sidebar-width))] items-center justify-between px-5 py-3 lg:flex"
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
          {isDepartmentDetailsRoute() &&
            checkFeatureAvailability(FEATURES.DEPARTMENT_SETTING) && (
              <Link
                to={`${PrivatePageEndPoints.departments.details.settings.path.replace(
                  ":id",
                  id ?? "",
                )}`}
                className="hover:bg-foreground/5 flex cursor-pointer items-center gap-x-2 rounded-md p-2 transition-colors duration-200"
              >
                <Settings size={20} />
                <p>Department Settings</p>
              </Link>
            )}
          <div className="flex items-center gap-x-2">
            <Avatar className="size-10 border border-gray-200">
              <AvatarImage src={authState?.userData?.profile ?? ""} />
              <AvatarFallback>
                {getInitials(authState?.userData?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <p>{authState?.userData?.name}</p>
          </div>
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
            {isDepartmentDetailsRoute() &&
              checkFeatureAvailability(FEATURES.DEPARTMENT_SETTING) && (
                <Link
                  to={`${PrivatePageEndPoints.departments.details.settings.path.replace(
                    ":id",
                    id ?? "",
                  )}`}
                  className="hover:bg-foreground/5 flex cursor-pointer items-center gap-x-2 rounded-md p-2 transition-colors duration-200"
                >
                  <Settings size={20} />
                </Link>
              )}
            <Avatar>
              <AvatarImage src={authState?.userData?.profile ?? ""} />
              <AvatarFallback>
                {getInitials(authState?.userData?.name ?? "")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
