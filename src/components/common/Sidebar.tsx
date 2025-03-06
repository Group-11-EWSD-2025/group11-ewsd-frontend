import DepartmentForm from "@/components/common/DepartmentForm";
import UserForm from "@/components/common/UserForm";
import { Button } from "@/components/ui/button";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { cn, showDialog } from "@/lib/utils";
import {
  Building2,
  ChartLine,
  Ellipsis,
  LogOut,
  PanelLeftClose,
  Plus,
  Tags,
  User,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  action?: () => void;
};

const departments = [
  "Business & Management",
  "Architecture & Design",
  "Education & Teaching",
];

const sidebarItems: SidebarItem[][] = [
  [
    {
      icon: <Tags size={20} />,
      label: "Categories",
      href: PrivatePageEndPoints.categories.path,
    },
    {
      icon: <ChartLine size={20} />,
      label: "Insights",
      href: PrivatePageEndPoints.insights.path,
    },
    {
      icon: <Users size={20} />,
      label: "Users Management",
      href: PrivatePageEndPoints.users.path,
    },
  ],
  [
    {
      icon: <User size={20} />,
      label: "Account Settings",
      href: PrivatePageEndPoints.accountSettings.path,
    },
    {
      icon: <LogOut size={20} />,
      label: "Logout",
      href: "",
      action: () => {
        console.log("logout");
      },
    },
  ],
];

const Sidebar = ({ setIsSidebarOpen }: Props) => {
  const currentPath = useLocation().pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  function handleCreateDepartment() {
    console.log("create department");
    showDialog({
      title: "Create Department",
      children: <DepartmentForm />,
    });
  }

  function handleCreateUser() {
    console.log("create user");
    showDialog({
      title: "Create User",
      children: <UserForm />,
    });
  }

  return (
    <nav className="border-border-weak flex h-screen w-[var(--sidebar-width)] flex-col justify-between border-r bg-white lg:border-0">
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <h1 className="text-lg font-semibold lg:text-xl">IdeaHub</h1>
          <PanelLeftClose
            size={20}
            className="cursor-pointer lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <div className="flex flex-col gap-y-1 p-2">
          <p className="text-brand px-2 py-1.5 text-sm">Departments</p>
          {departments.map((department) => (
            <div
              key={department}
              className="hover:bg-surface-weak group grid cursor-pointer grid-cols-[1fr_auto] items-center justify-between gap-x-2.5 rounded-md px-2 py-1.5 transition-colors"
            >
              <div className="grid grid-cols-[20px_1fr] items-center gap-x-2.5">
                <Building2 size={20} />
                <p className="max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-black">
                  {department}
                </p>
              </div>
              <Ellipsis
                className="text-brand invisible group-hover:visible"
                size={20}
              />
            </div>
          ))}
          <Button
            variant="ghost"
            className="justify-start gap-x-2.5 px-2 text-base font-normal"
            onClick={handleCreateDepartment}
          >
            <Plus size={20} className="text-brand" />
            <p className="text-brand">Create New</p>
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-x-2.5 px-2 text-base font-normal"
            onClick={handleCreateUser}
          >
            <Plus size={20} className="text-brand" />
            <p className="text-brand">Create New User</p>
          </Button>
        </div>
        <div className="flex flex-col gap-y-1 p-2">
          {sidebarItems[0].map((item) => (
            <Link key={item.label} to={item.href}>
              <div
                className={cn(
                  "hover:bg-surface-weak flex cursor-pointer items-center gap-x-2.5 rounded-md px-2 py-1.5 transition-colors",
                  isActive(item.href) && "bg-surface-weak",
                )}
              >
                {item.icon}
                <p className="text-black">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-border-weak border-t px-2 py-3">
        {sidebarItems[1].map((item) => {
          const menuItem = (
            <div
              className={cn(
                "hover:bg-surface-weak flex cursor-pointer items-center gap-x-2.5 rounded-md px-2 py-1.5 transition-colors",
                isActive(item.href) && "bg-surface-weak",
              )}
            >
              {item.icon}
              <p className="text-black">{item.label}</p>
            </div>
          );

          return item.href ? (
            <Link to={item.href} key={item.label}>
              {menuItem}
            </Link>
          ) : (
            <div key={item.label} onClick={item.action}>
              {menuItem}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;
