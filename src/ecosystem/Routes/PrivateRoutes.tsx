import { PrivatePageEndPoints } from "@/ecosystem/PageEndpoints/Private";
import { flattenRoutes } from "@/ecosystem/router";
import DashboardLayout from "@/layouts/dashboard.layout";
import { Navigate, Route, Routes } from "react-router-dom";

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {flattenRoutes(PrivatePageEndPoints).map(
          ({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ),
        )}
      </Route>
      <Route
        path="/*"
        element={<Navigate to={PrivatePageEndPoints.root.path} replace />}
      />
    </Routes>
  );
};

export default PrivateRoutes;
