import { TriangleAlert } from "lucide-react";

function NoDataFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 text-yellow-500">
      <TriangleAlert className="size-4" />
      <p>No data found</p>
    </div>
  );
}

export default NoDataFound;
