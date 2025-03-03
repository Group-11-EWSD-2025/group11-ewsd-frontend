import { LoaderCircleIcon } from "lucide-react";
import { Suspense } from "react";

const Loadable =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <LoaderCircleIcon className="size-4 animate-spin" />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );

export default Loadable;
