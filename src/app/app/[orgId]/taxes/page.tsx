"use client"

import { TaxList } from '@/components/taxes/TaxList'
import { useOrgId } from '@/hooks/organizations/useOrgId'
import React from 'react'

const TaxesPages = () => {
    const orId = useOrgId()
    if (!orId) {
        return null
    }
  return (
    <TaxList organizationId={orId} />
  )
}

export default TaxesPages