import { ChartLine, LogOut, Plus, Tags, User, Users } from "lucide-react";

const Sidebar = () => {
  const sidebarItems = [
    [
      {
        icon: <Tags size={20} />,
        label: "Categories",
      },
      {
        icon: <ChartLine size={20} />,
        label: "Insights",
      },
      {
        icon: <Users size={20} />,
        label: "Users Management",
      },
    ],
    [
      {
        icon: <User size={20} />,
        label: "Account Settings",
      },
      {
        icon: <LogOut size={20} />,
        label: "Logout",
        action: () => {
          console.log("logout");
        },
      },
    ],
  ];

  return (
    <div className="flex h-screen w-[256px] flex-col justify-between bg-white">
      <div className="flex flex-col gap-y-2">
        <div className="px-4 pt-5 pb-2">
          <h1 className="text-xl font-semibold">IdeaHub</h1>
        </div>
        <div className="flex flex-col gap-y-1 p-2">
          <p className="text-brand px-2 py-1.5 text-sm">Departments</p>
          <div className="hover:bg-surface-weak flex cursor-pointer items-center gap-x-2.5 rounded-md px-2 py-1.5 transition-colors">
            <Plus size={16} />
            <p className="text-brand">Create New</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-1 p-2">
          {sidebarItems[0].map((item) => (
            <div className="hover:bg-surface-weak flex cursor-pointer items-center gap-x-2.5 rounded-md px-2 py-1.5 transition-colors">
              {item.icon}
              <p className="text-black">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-border-weak border-t px-2 py-3">
        {sidebarItems[1].map((item) => (
          <div className="hover:bg-brand/10 flex cursor-pointer items-center gap-x-2.5 rounded-md px-2 py-1.5 transition-colors">
            {item.icon}
            <p className="text-black">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
