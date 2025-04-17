import { Button } from "@/components/ui/button";
import { PublicPageEndPoints } from "@/ecosystem/PageEndpoints/Public";
import { CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";

const RequestResetPasswordSuccess = () => {
  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center gap-y-7">
      <h2 className="text-2xl font-semibold">IdeaHub</h2>
      <div className="flex w-[384px] flex-col items-center gap-y-6 rounded-xl bg-white p-6 shadow-md">
        <CircleCheck size={32} />
        <div className="flex flex-col gap-y-2 text-center">
          <h3 className="text-2xl font-semibold">Request Sent Successfully</h3>
          <p className="text-sm text-gray-500">
            Your password reset request has been sent to the administrator.
            You’ll be notified once your new password is ready.
          </p>
        </div>
        <Link to={PublicPageEndPoints.login.root.path} className="w-full">
          <Button variant={"outline"} className="w-full">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RequestResetPasswordSuccess;
