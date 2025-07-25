import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import AxiosInstance from "@/lib/axios"
import type { Item } from "@/lib/types"

// Get all items for an organization
export const useItems = (organizationId: string) => {
  return useQuery({
    queryKey: ["items", organizationId],
    queryFn: async (): Promise<Item[]> => {
      const { data } = (await AxiosInstance.get(`/${organizationId}/items`)).data
      return data
    },
    enabled: !!organizationId,
  })
}

// Get item by ID
export const useItem = (organizationId: string, itemId: string) => {
  return useQuery({
    queryKey: ["items", organizationId, itemId],
    queryFn: async (): Promise<Item> => {
      const { data } = (await AxiosInstance.get(`/${organizationId}/items/${itemId}`)).data
      return data
    },
    enabled: !!organizationId && !!itemId,
  })
}

// Create item
export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ organizationId, item }: { organizationId: string; item: Omit<Item, "id"> }): Promise<Item> => {
      const { data } = (await AxiosInstance.post(`/${organizationId}/items`, item)).data
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items", variables.organizationId] })
    },
  })
}
