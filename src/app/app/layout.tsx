"use client";


import { useAppStore } from "@/store/app.store";
import { useOrganizationStore } from "@/store/organization.store";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentOrganizationId = useOrganizationStore(
    (state) => state.currentOrganization?.id
  );
  const { setLoadingPhase, setLoading } = useAppStore();

  useEffect(() => {
    if (currentOrganizationId) {
      setLoadingPhase(null);
      setLoading(false);
    }
  }, [currentOrganizationId]);

  if (!currentOrganizationId) {
    return null
  }

  return <>{children}</>;
}
