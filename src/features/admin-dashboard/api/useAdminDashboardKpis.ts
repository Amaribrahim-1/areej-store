"use client";

import { useQuery } from "@tanstack/react-query";

import { ADMIN_DASHBOARD_KPIS_STALE_TIME_MS } from "../constants";
import { getAdminDashboardKpis } from "./getAdminDashboardKpis";
import { adminDashboardKpisQueryKey } from "./queryKeys";

export function useAdminDashboardKpis() {
  return useQuery({
    queryKey: adminDashboardKpisQueryKey,
    queryFn: getAdminDashboardKpis,
    staleTime: ADMIN_DASHBOARD_KPIS_STALE_TIME_MS,
  });
}
