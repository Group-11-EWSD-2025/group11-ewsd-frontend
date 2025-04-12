import { PublicPageEndPoints } from "@/ecosystem/PageEndpoints/Public";
import { flattenRoutes } from "@/lib/utils";
import { Navigate, Route, Routes } from "react-router-dom";

const PublicRoutes = () => {
  return (
    <Routes>
      {flattenRoutes(PublicPageEndPoints).map(
        ({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ),
      )}
      <Route
        path="/*"
        element={<Navigate to={PublicPageEndPoints.login.path} replace />}
      />
    </Routes>
  );
};

export default PublicRoutes;
