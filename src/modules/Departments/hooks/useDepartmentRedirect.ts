import { DEPARTMENTS } from "@/constants";
import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useDepartmentRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const departmentId = pathname.split("/").pop();

  const redirectDepartment = useCallback(() => {
    if (DEPARTMENTS.length === 0) {
      navigate(PrivatePageEndPoints.departments.notFound.path);
    } else {
      navigate(
        !!departmentId
          ? PrivatePageEndPoints.departments.details.root.getHref(departmentId)
          : PrivatePageEndPoints.departments.details.root.getHref(
              DEPARTMENTS[0].id,
            ),
      );
    }
  }, [navigate, departmentId]);

  return { redirectDepartment };
}
