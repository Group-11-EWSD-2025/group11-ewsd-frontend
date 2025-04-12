import { useAuth } from "@/context/AuthContext";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { useGetDepartmentList } from "@/modules/Departments/api/queryGetDepartmentList";
import { TDepartment } from "@/types/departments";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function useDepartmentRedirect() {
  const { id: departmentId } = useParams();
  const navigate = useNavigate();
  const { authState } = useAuth();

  const getDepartmentList = useGetDepartmentList({
    params: {
      userId: authState.userData.id,
    },
  });

  function isDepartmentIdValid(departmentId: string) {
    if (
      departmentId &&
      !getDepartmentList.data?.data.body.some(
        (dept: TDepartment) => dept.id.toString() === departmentId,
      )
    ) {
      return false;
    }
    return true;
  }

  const redirectDepartment = useCallback(() => {
    if (!!getDepartmentList.data?.data.meta.status) {
      const departments = getDepartmentList.data?.data.body;
      if (departments.length === 0) {
        navigate(PrivatePageEndPoints.departments.notFound.path);
      } else {
        setTimeout(() => {
          if (!departmentId || !isDepartmentIdValid(departmentId)) {
            navigate(
              `${PrivatePageEndPoints.departments.details.root.path.replace(
                ":id",
                departments[0].id,
              )}`,
            );
          }
        }, 100);
      }
    }
  }, [getDepartmentList.data]);

  return {
    isDepartmentListLoading: getDepartmentList.isLoading,
    isDepartmentIdValid,
    redirectDepartment,
  };
}
