  "use client";

  import { useAuthStore } from "../stores/auth-store";
  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";

  export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading, checkAuth, hasCheckedAuth, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if(!hasCheckedAuth){
        checkAuth();
      }
    }, [hasCheckedAuth]);

    useEffect(() => {
      if (!isLoading  && hasCheckedAuth &&  !isAuthenticated) {
        const fullUrl = window.location.href;
        router.replace(`${process.env.NEXT_PUBLIC_AUTH_CLIENT_URL}/auth/login?next=${encodeURIComponent(fullUrl)}`);
      }
    }, [isAuthenticated, isLoading, hasCheckedAuth]);

    if (!hasCheckedAuth || isLoading || !isAuthenticated) {
      return (
        <div className="flex h-screen justify-center items-center">
          <p>Chargement...</p>
        </div>
      );
    }

    return <>{children}</>;
  };
