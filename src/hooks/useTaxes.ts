import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import AxiosInstance from "@/lib/axios"
import type { Tax } from "@/lib/types"

// Get all taxes for an organization
export const useTaxes = (organizationId: string) => {
  return useQuery({
    queryKey: ["taxes", organizationId],
    queryFn: async (): Promise<Tax[]> => {
      const { data } = (await AxiosInstance.get(`/settings/${organizationId}/taxes`)).data
      return data
    },
    enabled: !!organizationId,
  })
}

// Get tax by ID
export const useTax = (organizationId: string, taxId: string) => {
  return useQuery({
    queryKey: ["taxes", organizationId, taxId],
    queryFn: async (): Promise<Tax> => {
      const { data } = (await AxiosInstance.get(`/settings/${organizationId}/taxes/${taxId}`)).data
      return data
    },
    enabled: !!organizationId && !!taxId,
  })
}

// Create tax
export const useCreateTax = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ organizationId, tax }: { organizationId: string; tax: Omit<Tax, "id"> }): Promise<Tax> => {
      const { data } = (await AxiosInstance.post(`/settings/${organizationId}/taxes`, tax)).data
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["taxes", variables.organizationId] })
    },
  })
}
