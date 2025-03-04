import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, Settings } from "lucide-react";

type Props = {
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

const Topbar = ({ setIsSidebarOpen }: Props) => {
  return (
    <>
      <div
        className="z-10 hidden h-[var(--topbar-height)] items-center justify-between px-5 lg:flex"
        style={{
          background: "linear-gradient(180deg, #F3F4F6 0%, #FFFFFF 100%)",
        }}
      >
        <h1 className="text-xl font-semibold">Business & Management</h1>
        <div className="flex items-center gap-x-7">
          <div className="flex cursor-pointer items-center gap-x-2 py-2">
            <Settings size={20} />
            <p>Department Settings</p>
          </div>
          <div className="bg-border h-8 w-px"></div>
          <Bell size={20} />
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
            <Settings size={20} />
            <Bell size={20} />
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <h1 className="py-2 text-lg font-semibold">Business & Management</h1>
      </div>
    </>
  );
};

export default Topbar;
