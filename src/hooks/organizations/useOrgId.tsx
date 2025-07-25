import { useOrganizationStore } from '@/store/organization.store'

export const useOrgId = () => {
    const { currentOrganization } = useOrganizationStore()
    return currentOrganization?.id
}