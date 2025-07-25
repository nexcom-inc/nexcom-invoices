import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import AxiosInstance from "@/lib/axios";
import type { Invoice } from "@/lib/types"

// Get all invoices for an organization
export const useInvoices = (organizationId: string) => {
  return useQuery({
    queryKey: ["invoices", organizationId],
    queryFn: async (): Promise<Invoice[]> => {
      const { data } = (await AxiosInstance.get(`/${organizationId}/invoices`)).data
      return data
    },
    enabled: !!organizationId,
  })
}

// Get invoice by ID
export const useInvoice = (organizationId: string, invoiceId: string) => {
  return useQuery({
    queryKey: ["invoices", organizationId, invoiceId],
    queryFn: async (): Promise<Invoice> => {
      const { data } = (await AxiosInstance.get(`/${organizationId}/invoices/${invoiceId}`)).data
      return data
    },
    enabled: !!organizationId && !!invoiceId,
  })
}

// Create invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      organizationId,
      invoice,
    }: { organizationId: string; invoice: Omit<Invoice, "id"> }): Promise<Invoice> => {
      const { data } = (await AxiosInstance.post(`/${organizationId}/invoices`, invoice)).data
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices", variables.organizationId] })
    },
  })
}

// Get invoice PDF
export const useInvoicePdf = () => {
  return useMutation({
    mutationFn: async ({ organizationId, invoiceId }: { organizationId: string; invoiceId: string }): Promise<Blob> => {
      const response = await AxiosInstance.get(`/${organizationId}/invoices/${invoiceId}/pdf`, {
        responseType: "blob",
      })
      return response.data
    },
  })
}

// Send invoice by email
export const useSendInvoice = () => {
  return useMutation({
    mutationFn: async ({ organizationId, invoiceId }: { organizationId: string; invoiceId: string }): Promise<void> => {
      await AxiosInstance.post(`/${organizationId}/${invoiceId}/send`)
    },
  })
}
