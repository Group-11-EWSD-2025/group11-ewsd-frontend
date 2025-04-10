import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

function ReportButton() {
  function handleReport() {
    console.log("Report");
  }

  return (
    <Button
      variant="ghost"
      className="flex cursor-pointer items-center gap-x-2"
      onClick={handleReport}
    >
      <Flag size={20} className="text-brand" />
      <p className="text-brand font-normal">Report</p>
    </Button>
  );
}

export default ReportButton;
