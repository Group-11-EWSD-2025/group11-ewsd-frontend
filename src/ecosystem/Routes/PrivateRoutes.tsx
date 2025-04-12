import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { useAuthorize } from "@/hooks/useAuthorize";
import DashboardLayout from "@/layouts/dashboard.layout";
import { flattenRoutes } from "@/lib/utils";
import { Navigate, Route, Routes } from "react-router-dom";

const PrivateRoutes = () => {
  const { checkEndpointAvailability } = useAuthorize();

  const allRoutes = flattenRoutes(PrivatePageEndPoints);

  const authorizedRoutes = allRoutes.filter((route) => {
    const isAuthorized = checkEndpointAvailability(route.path);
    return isAuthorized;
  });

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {authorizedRoutes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
      <Route
        path="/*"
        element={<Navigate to={PrivatePageEndPoints.root.path} replace />}
      />
    </Routes>
  );
};

export default PrivateRoutes;
