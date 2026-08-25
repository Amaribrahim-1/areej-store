"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_CONTACT_MESSAGES_STALE_TIME_MS } from "../constants";
import { getAdminContactMessages } from "./getAdminContactMessages";
import { adminContactMessagesQueryKey } from "./queryKeys";

export function useAdminContactMessages() {
  return useQuery({
    queryKey: adminContactMessagesQueryKey(),
    queryFn: getAdminContactMessages,
    staleTime: ADMIN_CONTACT_MESSAGES_STALE_TIME_MS,
  });
}
