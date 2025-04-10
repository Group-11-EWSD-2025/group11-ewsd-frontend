import { TUser } from "@/types/users";
import { Laptop } from "lucide-react";

interface LoginActivityProps {
  user: TUser;
}

const LoginActivity = ({ user }: LoginActivityProps) => {
  // This would typically come from an API call
  const loginActivities = [
    {
      date: "May 20, 2024",
      time: "2:35 PM",
      ipAddress: "182.1.2.53",
    },
    {
      date: "May 20, 2024",
      time: "2:35 PM",
      ipAddress: "182.1.2.53",
    },
    {
      date: "May 20, 2024",
      time: "2:35 PM",
      ipAddress: "182.1.2.53",
    },
  ];

  return (
    <div className="space-y-4">
      {/* User Info Header */}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <div className="text-gray-700">Login Activity</div>
      {/* Login Activities List */}
      <div className="divide-y divide-gray-200">
        {loginActivities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 bg-white py-3">
            <Laptop className="mt-1 size-5 text-gray-500" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span>{activity.date}</span>
                <span>at</span>
                <span>{activity.time}</span>
              </div>
              <div className="text-sm text-gray-500">
                IP address: {activity.ipAddress}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginActivity;
