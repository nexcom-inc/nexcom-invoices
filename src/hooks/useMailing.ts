/* eslint-disable */


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import AxiosInstance from "@/lib/axios"
import type { MailingConfig } from "@/lib/types"

// Get mailing config for an organization
export const useMailingConfig = (organizationId: string) => {
  return useQuery({
    queryKey: ["mailing-config", organizationId],
    queryFn: async (): Promise<MailingConfig> => {
      const { data } = (await AxiosInstance.get(`/settings/${organizationId}/mailing-config`)).data
      return data
    },
    enabled: !!organizationId,
  })
}

// Create/Update mailing config
export const useCreateMailingConfig = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      organizationId,
      config,
    }: { organizationId: string; config: Omit<MailingConfig, "id"> }): Promise<MailingConfig> => {
      const { data } = (await AxiosInstance.post(`/settings/${organizationId}/mailing-config`, config)).data
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mailing-config", variables.organizationId] })
    },
  })
}

// Test mailing connection
export const useTestMailingConnection = () => {
  return useMutation({
    mutationFn: async (organizationId: string): Promise<void> => {
      (await AxiosInstance.get(`/settings/${organizationId}/mailing/test-connection`)).data
    },
  })
}

// Send test email
export const useSendTestEmail = () => {
  return useMutation({
    mutationFn: async (organizationId: string): Promise<void> => {
      (await AxiosInstance.post(`/settings/${organizationId}/mailing/send-test-email`)).data
    },
  })
}
