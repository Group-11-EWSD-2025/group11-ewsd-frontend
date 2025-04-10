import { TriangleAlert } from "lucide-react";

function NoDataFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 text-yellow-600">
      <TriangleAlert className="size-4" />
      <p className="text-sm">No data found</p>
    </div>
  );
}

export default NoDataFound;
