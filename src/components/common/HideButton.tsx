import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

function HideButton({ isHidden = false }: { isHidden?: boolean }) {
  function handleHide() {
    console.log("Hide");
  }

  return (
    <Button
      variant="ghost"
      className="flex cursor-pointer items-center gap-x-2"
      onClick={handleHide}
    >
      {isHidden ? (
        <Eye size={20} className="text-brand" />
      ) : (
        <EyeOff size={20} className="text-brand" />
      )}
      <p className="text-brand font-normal">{isHidden ? "Unhide" : "Hide"}</p>
    </Button>
  );
}

export default HideButton;
