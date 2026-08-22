import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  isAdminOrderSort,
  isOrderStatus,
  type AdminOrderSort,
  type OrderStatus,
} from "../constants";

export default function useAdminOrdersListParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const statusRaw = searchParams.get("status") ?? "";
  const selectedStatus: OrderStatus | undefined = isOrderStatus(statusRaw)
    ? statusRaw
    : undefined;

  const sortRaw = searchParams.get("sort") ?? "";
  const selectedSort: AdminOrderSort = isAdminOrderSort(sortRaw)
    ? sortRaw
    : "newest";

  function updateListParam(key: "status" | "sort", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && !(key === "sort" && value === "newest")) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return {
    selectedStatus,
    selectedSort,
    updateListParam,
  };
}
