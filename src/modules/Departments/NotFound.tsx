import { Button } from "@/components/ui/button";
import { DEPARTMENTS } from "@/constants";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { CircleCheck, Plus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  "Once departments are available, staff can start submitting their ideas.",
  "You'll be able to manage categories, oversee submissions, and track engagement.",
];

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    if (DEPARTMENTS.length > 0) {
      navigate(
        PrivatePageEndPoints.departments.details.root.getHref(DEPARTMENTS[0].id),
      );
    }
  }, [DEPARTMENTS.length, navigate]);

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="border-border-weak m-auto max-w-[540px] space-y-7 rounded-xl border bg-white p-4 lg:p-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-medium">🎉 Welcome to IdeaHub</h2>
          <p className="text-brand">
            It looks like no departments have been set up yet. Departments help
            organize idea submissions and ensure a smooth review process.
          </p>
        </div>
        <hr className="border-border-weak" />
        <div className="space-y-5">
          <h3 className="text-lg font-medium">What’s next step?</h3>
          <ul className="space-y-5">
            {steps.map((step) => (
              <li key={step} className="grid grid-cols-[20px_1fr] gap-x-4">
                <CircleCheck size={20} className="text-brand" />
                <p className="text-brand">{step}</p>
              </li>
            ))}
          </ul>
        </div>
        <Button className="w-full">
          <Plus size={20} />
          Create Department
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
