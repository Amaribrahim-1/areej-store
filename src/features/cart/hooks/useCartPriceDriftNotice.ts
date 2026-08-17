"use client";

import { useEffect, useState } from "react";

import { lineKey } from "../lib/lineKey";
import { resolveCartPriceDrift } from "../lib/resolveCartPriceDrift";
import type { CartLine, CartPriceSnapshotUpdate } from "../store";
import type { CartLineDetailsResult } from "../types";

/**
 * Detects price drift between persisted cart snapshots and live prices,
 * syncs the snapshots, and reports whether to show the drift notice.
 * Shared by the cart page and checkout review step (task 4.4) so both
 * surfaces stay in sync instead of duplicating the effect.
 */
export function useCartPriceDriftNotice(
  data: CartLineDetailsResult | undefined,
  items: CartLine[],
  syncUnitPriceSnapshots: (updates: CartPriceSnapshotUpdate[]) => void,
): boolean {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!data || items.length === 0) return;

    const liveDetailsByKey = new Map(
      data.lines.map((detail) => [
        lineKey(detail.productId, detail.variantId),
        detail,
      ]),
    );

    const { hasDrift, updates } = resolveCartPriceDrift(
      items,
      liveDetailsByKey,
    );

    if (updates.length > 0) {
      syncUnitPriceSnapshots(updates);
    }

    if (hasDrift) {
      setShowNotice(true);
    }
  }, [data, items, syncUnitPriceSnapshots]);

  return showNotice;
}
