import { TUser } from "@/types/users";
import { Laptop } from "lucide-react";
import { useGetUserLoginActivity } from "../api/queryGetUserLoginActivity";

interface LoginActivityProps {
  user: TUser;
}

const LoginActivity = ({ user }: LoginActivityProps) => {
  const { data: loginActivitiesData } = useGetUserLoginActivity({
    params: {
      userId: user.id.toString(),
    },
  });

  return (
    <div className="space-y-4">
      {/* User Info Header */}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <p className="text-gray-500">{user.email}</p>
      </div>
      {loginActivitiesData?.body.length === 0 ? (
        <div className="flex items-center justify-center py-4 text-gray-500">
          No login activity found
        </div>
      ) : (
        <>
          <div className="text-gray-700">Login Activity</div>
          {/* Login Activities List */}
          <div className="divide-y divide-gray-200">
            {loginActivitiesData?.body.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 bg-white py-3"
              >
                <Laptop className="mt-1 size-5 text-gray-500" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span>{activity.login_at}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    IP address: {activity.ip_address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LoginActivity;
