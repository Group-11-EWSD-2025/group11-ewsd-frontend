import { AlertCircle } from "lucide-react";

function FetchErrorText() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 text-red-500">
      <AlertCircle className="size-4" />
      <p className="text-sm">Failed to fetch</p>
    </div>
  );
}

export default FetchErrorText;
