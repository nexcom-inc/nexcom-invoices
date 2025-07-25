import { buildUrlWithOrg } from "@/lib/helpers/build-url-with-org"
import { useOrganizationStore } from "@/store/organization.store"
import { useRouter } from "next/navigation"

// Hook pour naviguer en gardant l'organisation
export const useOrgNavigation = () => {
  const router = useRouter()
  const { currentOrganization } = useOrganizationStore()
  
  const navigateTo = (path: string) => {
    if (currentOrganization) {
      const finalPath = buildUrlWithOrg(path, currentOrganization.id)
      router.push(finalPath)
    } else {
      router.push(path)
    }
  }
  
  const replaceTo = (path: string) => {
    if (currentOrganization) {
      const finalPath = buildUrlWithOrg(path, currentOrganization.id)
      router.replace(finalPath)
    } else {
      router.replace(path)
    }
  }
  
  return { navigateTo, replaceTo }
}