import { QueryClient, type FetchQueryOptions } from "@tanstack/react-query";

export { createPrefetchQueryClient } from "./getQueryClient";

/** Prefetch without dehydrating an error — the client hook can retry. */
export async function prefetchQuerySafe(
  queryClient: QueryClient,
  options: FetchQueryOptions,
) {
  try {
    await queryClient.fetchQuery(options);
  } catch {
    if (options.queryKey) {
      queryClient.removeQueries({ queryKey: options.queryKey });
    }
  }
}
