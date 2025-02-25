import { QueryClient } from "@tanstack/react-query";
import { fallbackTerms } from "@shared/schema";
import type { Term } from "@shared/schema";

const localData = {
  '/api/terms': fallbackTerms,
};

// Local data fetcher that uses only fallback data
async function localDataFetcher<T>({ queryKey }: { queryKey: string[] }): Promise<T> {
  const path = queryKey[0];
  return localData[path] as T;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: localDataFetcher,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
      // Use fallback data
      placeholderData: (context) => {
        const path = context?.queryKey[0];
        return localData[path] || [];
      },
    },
    mutations: {
      retry: false,
    },
  },
});