import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import AxiosInstance from "@/lib/axios"
import type { Organization } from "@/lib/types"

// Get all organizations
export const useOrganizations = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: async (): Promise<Organization[]> => {
      const { data } = (await AxiosInstance.get("/organizations")).data
      return data
    },
  })
}

// Get organization by ID
export const useOrganization = (organizationId: string) => {
  return useQuery({
    queryKey: ["organizations", organizationId],
    queryFn: async (): Promise<Organization> => {
      const { data } = (await AxiosInstance.get(`/organizations/${organizationId}`)).data
      return data
    },
    enabled: !!organizationId,
  })
}

// Create organization
export const useCreateOrganization = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (organization: Omit<Organization, "id">): Promise<Organization> => {
      const { data } = (await AxiosInstance.post("/organizations", organization)).data
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] })
    },
  })
}
