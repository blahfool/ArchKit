import { QueryClient } from "@tanstack/react-query";
import { fallbackTerms } from "@shared/schema";
import type { Term } from "@shared/schema";

// Store for local data
const localData = {
  '/api/terms': fallbackTerms,
};

// Simplified local data fetcher
async function localDataFetcher<T>({ queryKey }: { queryKey: string[] }): Promise<T> {
  const [path] = queryKey;
  if (path in localData) {
    return localData[path] as T;
  }
  throw new Error(`No local data found for ${path}`);
}

// Create query client with local data only
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: localDataFetcher,
      staleTime: Infinity, // Data never goes stale since it's local
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      // Use local data
      placeholderData: (context) => {
        const [path] = context?.queryKey || [];
        return path in localData ? localData[path] : undefined;
      },
    },
  },
});

// Helper for mutations (simulated API calls)
export async function apiRequest<T>(
  path: string,
  method: 'POST' | 'PUT' | 'DELETE',
  data?: unknown
): Promise<T> {
  // Simulate API call but work with local data
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

  if (method === 'POST' && path === '/api/terms') {
    const newTerm = data as Term;
    localData['/api/terms'] = [...localData['/api/terms'], newTerm];
    return newTerm as T;
  }

  throw new Error(`Operation not supported: ${method} ${path}`);
}