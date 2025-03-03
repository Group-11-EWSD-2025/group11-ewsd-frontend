import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings } from "lucide-react";

const Topbar = () => {
  return (
    <div
      className="flex h-16 items-center justify-between px-5"
      style={{
        background: "linear-gradient(180deg, #F3F4F6 0%, #FFFFFF 100%)",
      }}
    >
      <h1 className="text-xl font-semibold">Business & Management</h1>
      <div className="flex items-center gap-x-7">
        <div className="flex items-center gap-x-2 py-2">
          <Settings size={20} />
          <p className="text-sm font-medium">Department Settings</p>
        </div>
        <div className="bg-border h-8 w-px"></div>
        <div className="flex items-center gap-x-2 py-2">
          <Bell size={20} />
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Topbar;
