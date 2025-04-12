import { useAuth } from "@/context/AuthContext";
import PrivateRoutes from "@/ecosystem/Routes/PrivateRoutes";
import PublicRoutes from "@/ecosystem/Routes/PublicRoutes";

const Router = () => {
  const { authState } = useAuth();

  return <>{!!authState.token ? <PrivateRoutes /> : <PublicRoutes />}</>;
};

export default Router;
