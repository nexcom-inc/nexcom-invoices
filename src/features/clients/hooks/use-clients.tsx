import apiClient from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const QUERY_KEYS = {
  clients: ["clients"],
  client: (id: string) => ["clients", id],
};

export const useClients = (orgId : string) => {
    return useQuery<Client[]>({
        queryKey : QUERY_KEYS.clients,
        queryFn: async () => {
            return (await apiClient.get(`/${orgId}/clients`)).data.data
        }
    })
}