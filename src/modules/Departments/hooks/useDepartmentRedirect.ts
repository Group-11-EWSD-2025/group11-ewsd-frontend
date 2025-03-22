import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { useGetDepartmentList } from "@/modules/Departments/api/queryGetDepartmentList";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useDepartmentRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const departmentId = pathname.split("/").pop();

  const getDepartmentList = useGetDepartmentList({});

  const redirectDepartment = useCallback(() => {
    if (getDepartmentList.data?.status === 200) {
      const departments = getDepartmentList.data?.data.body;
      if (departments.length === 0) {
        navigate(PrivatePageEndPoints.departments.notFound.path);
      } else {
        navigate(
          !!departmentId
            ? `${PrivatePageEndPoints.departments.details.root.path.replace(
                ":id",
                departmentId,
              )}`
            : `${PrivatePageEndPoints.departments.details.root.path.replace(
                ":id",
                departments[0].id,
              )}`,
        );
      }
    }
  }, [getDepartmentList.data]);

  return { redirectDepartment };
}
