import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** Server: new client per request. Browser: reuse so Suspense does not drop the cache. */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function createPrefetchQueryClient() {
  return makeQueryClient();
}
