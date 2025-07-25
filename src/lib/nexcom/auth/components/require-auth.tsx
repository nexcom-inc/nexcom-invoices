  "use client";

  import { useAuthStore } from "../stores/auth-store";
  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app.store";

  export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading, checkAuth, hasCheckedAuth } = useAuthStore();
    const {setLoadingPhase} = useAppStore()
    const router = useRouter();

    useEffect(() => {
      if(!hasCheckedAuth){
        setLoadingPhase('AUTHENTIFICATION')
        checkAuth();
      }
    }, [hasCheckedAuth]);

    useEffect(() => {
      if (!isLoading  && hasCheckedAuth &&  !isAuthenticated) {
        setLoadingPhase('AUTHENTIFICATION')
        const fullUrl = window.location.href;
        router.replace(`${process.env.NEXT_PUBLIC_AUTH_CLIENT_URL}/auth/login?next=${encodeURIComponent(fullUrl)}`);
      }
    }, [isAuthenticated, isLoading, hasCheckedAuth]);


    return <>{children}</>;
  };
