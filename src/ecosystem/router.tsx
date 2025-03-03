import { useAuth } from "@/context/AuthContext";
import PrivateRoutes from "@/ecosystem/Routes/PrivateRoutes";
import PublicRoutes from "@/ecosystem/Routes/PublicRoutes";

type Route = {
  path: string;
  component: React.ComponentType;
};

type Endpoints = {
  [key: string]: Route | Endpoints;
};

const isRoute = (route: unknown): route is Route => {
  return (
    typeof route === "object" &&
    route !== null &&
    "path" in route &&
    "component" in route
  );
};

export const flattenRoutes = (endpoints: Endpoints): Route[] => {
  return Object.values(endpoints).flatMap((route) =>
    isRoute(route) ? [route] : flattenRoutes(route as Endpoints),
  );
};

const Router = () => {
  const { authState } = useAuth();

  return <>{!!authState.token ? <PrivateRoutes /> : <PublicRoutes />}</>;
};

export default Router;
