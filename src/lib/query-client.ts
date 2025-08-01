// lib/query/client.ts
import { queryClientConfig } from '@/config/query-client.config'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({...queryClientConfig})