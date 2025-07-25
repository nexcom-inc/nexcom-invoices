"use client";
import { useAuthStore } from "@/lib/nexcom/auth/stores/auth-store";
import { useAppStore } from "@/store/app.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentOrganizationId = useOrganizationStore((state) => state.currentOrganization?.id);
  const {setLoadingPhase, setLoading} = useAppStore()

  useEffect(() => {
    if(isAuthenticated && currentOrganizationId){
      setLoadingPhase(null)
      setLoading(false)
    }
  }, [isAuthenticated, currentOrganizationId]);

  return <>{children}</>;
}
