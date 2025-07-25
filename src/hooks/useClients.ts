import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import AxiosInstance from "@/lib/axios"
import type { Client } from "@/lib/types"

// Get all clients for an organization
export const useClients = (organizationId: string) => {
  return useQuery({
    queryKey: ["clients", organizationId],
    queryFn: async (): Promise<Client[]> => {
      const { data } = (await AxiosInstance.get(`/${organizationId}/clients`)).data
      return data
    },
    enabled: !!organizationId,
  })
}

// Get client by ID
export const useClient = (organizationId: string, clientId: string) => {
  return useQuery({
    queryKey: ["clients", organizationId, clientId],
    queryFn: async (): Promise<Client> => {
      const { data } = (await AxiosInstance.get(`/${organizationId}/clients/${clientId}`)).data
      return data
    },
    enabled: !!organizationId && !!clientId,
  })
}

// Create client
export const useCreateClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      organizationId,
      client,
    }: { organizationId: string; client: Omit<Client, "id"> }): Promise<Client> => {
      const { data } = (await AxiosInstance.post(`/${organizationId}/clients`, client)).data
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients", variables.organizationId] })
    },
  })
}
