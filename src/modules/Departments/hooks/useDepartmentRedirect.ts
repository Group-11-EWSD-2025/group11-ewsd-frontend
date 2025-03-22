import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { useGetDepartmentList } from "@/modules/Departments/api/queryGetDepartmentList";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function useDepartmentRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();
  const departmentId = id;

  const getDepartmentList = useGetDepartmentList({});

  const redirectDepartment = useCallback(() => {
    if (getDepartmentList.data?.status === 200) {
      const departments = getDepartmentList.data?.data.body;
      if (departments.length === 0) {
        navigate(PrivatePageEndPoints.departments.notFound.path);
      } else {
        setTimeout(() => {
          console.log(!!departmentId, departments[0].id);
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
        }, 100);
      }
    }
  }, [getDepartmentList.data]);

  return { redirectDepartment };
}
