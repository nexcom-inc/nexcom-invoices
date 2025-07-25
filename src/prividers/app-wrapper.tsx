"use client"

import { RequireOrganization } from "@/components/organizations/require-organization"
import { RequireAuth } from "@/lib/nexcom/auth/components/require-auth"

interface AppWrapperProps {
  children: React.ReactNode
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
  return (
    <RequireAuth>
      <RequireOrganization>
        {children}
      </RequireOrganization>
    </RequireAuth>
  )
}
