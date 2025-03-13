import { useDepartmentRedirect } from "@/modules/Departments/hooks/useDepartmentRedirect";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const Home = () => {
  const { redirectDepartment } = useDepartmentRedirect();

  useEffect(() => {
    redirectDepartment();
  }, [redirectDepartment]);

  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="animate-spin" size={24} />
    </div>
  );
};

export default Home;
