import { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig : QueryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: false,
            gcTime : 10 * 60 * 1000
        },
    },
}