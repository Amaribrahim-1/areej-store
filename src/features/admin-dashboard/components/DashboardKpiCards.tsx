import { BanknoteIcon, ClockIcon, PackageIcon } from "lucide-react";

import { formatPrice } from "@/components/shared/PriceTag";

import type { AdminDashboardKpis } from "../types";

import DashboardKpiCard from "./DashboardKpiCard";

const countFormatter = new Intl.NumberFormat("ar-EG");

type DashboardKpiCardsProps = {
  kpis: AdminDashboardKpis;
};

export default function DashboardKpiCards({ kpis }: DashboardKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
      <DashboardKpiCard
        title="إجمالي المبيعات"
        description="مجموع الطلبات اللي تم توصيلها"
        displayValue={formatPrice(kpis.totalSales)}
        icon={BanknoteIcon}
      />
      <DashboardKpiCard
        title="طلبات قيد المراجعة"
        description="الطلبات اللي لسه حالتها قيد المراجعة"
        displayValue={countFormatter.format(kpis.pendingOrders)}
        icon={ClockIcon}
      />
      <DashboardKpiCard
        title="المنتجات"
        description="كل المنتجات بما فيها غير الظاهرة"
        displayValue={countFormatter.format(kpis.totalProducts)}
        icon={PackageIcon}
      />
    </div>
  );
}
