import { hideDialog, showDialog } from "@/lib/utils";
import { useGetProfile } from "@/modules/Auth/api/queryGetProfile";
import { useDepartmentRedirect } from "@/modules/Departments/hooks/useDepartmentRedirect";
import { TUser } from "@/types/users";
import { format } from "date-fns";
import { Laptop, Loader2 } from "lucide-react";
import { useEffect } from "react";

const Home = () => {
  const { redirectDepartment } = useDepartmentRedirect();

  const getProfile = useGetProfile({
    queryConfig: {
      enabled: false,
    },
  });

  useEffect(() => {
    redirectDepartment();
    getProfile.refetch().then((res) => {
      const isFirstTime = !res.data?.data?.body.last_login_at;

      showDialog({
        title: isFirstTime ? "🎉 Welcome to IdeaHub!" : "🎉 Welcome back!",
        description: isFirstTime
          ? "Let's start creating new ideas and contribute your thoughts with other and help improve our university."
          : "Let's start creating new ideas and contribute your thoughts with other and help improve our university.",
        children: !isFirstTime ? (
          <WelcomeDialog userData={res.data?.data?.body} />
        ) : null,
        action: {
          label: isFirstTime ? "Let's Get Started" : "Ok, got it!",
          onClick: () => {
            hideDialog();
          },
        },
      });
    });
  }, [redirectDepartment, getProfile]);

  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="animate-spin" size={24} />
    </div>
  );
};

function WelcomeDialog({ userData }: { userData: TUser }) {
  return (
    <div className="divide-y divide-gray-200">
      <div className="bg-surface-weak flex items-start gap-3 rounded-md p-4">
        <Laptop className="size-6 text-gray-500" />
        <div className="flex flex-col space-y-1">
          <p>Your last logged in activity</p>
          <p className="text-gray-500">
            {format(
              new Date(userData.last_login_at?.created_at || new Date()),
              "MMM d, yyyy h:mm a",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
