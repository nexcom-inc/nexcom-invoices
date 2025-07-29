"use client"

import { InvitationList } from '@/components/invitation/InvitationList'
import { useOrgId } from '@/hooks/organizations/useOrgId'
import React from 'react'

const InvitationsPage = () => {
    const orgId = useOrgId()
    if (!orgId) {
        return null
    }
  return (
    <InvitationList organizationId={orgId} />
  )
}

export default InvitationsPage