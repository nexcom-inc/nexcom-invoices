"use client";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
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

  return (
<div className="flex h-screen bg-gray-100">
        <Sidebar
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
  )
}
