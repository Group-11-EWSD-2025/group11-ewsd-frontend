import Dialog from "@/components/common/Dialog";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import Router from "@/ecosystem/router";
import RecoilStatePortal from "@/recoil/recoil-portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NuqsAdapter>
            <AuthProvider>
              <RecoilStatePortal />
              <Router />
              <Toaster />
              <Dialog />
            </AuthProvider>
          </NuqsAdapter>
        </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
