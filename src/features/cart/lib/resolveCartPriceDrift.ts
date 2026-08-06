import { lineKey } from "./lineKey";
import type { CartLine, CartPriceSnapshotUpdate } from "../store";
import type { CartLineDetail } from "../types";

export type CartPriceDriftResult = {
  /** True when at least one line's stored snapshot differs from live currentPrice. */
  hasDrift: boolean;
  /** Snapshot updates to apply (drifted lines + legacy lines missing a snapshot). */
  updates: CartPriceSnapshotUpdate[];
};

/**
 * Compares persisted unit price snapshots to live cart line details.
 * Missing snapshots (pre–price-drift carts) are synced silently — no drift flag.
 */
export function resolveCartPriceDrift(
  items: CartLine[],
  detailsByKey: Map<string, CartLineDetail>,
): CartPriceDriftResult {
  const updates: CartPriceSnapshotUpdate[] = [];
  let hasDrift = false;

  for (const item of items) {
    const detail = detailsByKey.get(lineKey(item.productId, item.variantId));
    if (!detail) continue;

    if (item.unitPriceSnapshot == null) {
      updates.push({
        productId: item.productId,
        variantId: item.variantId,
        unitPriceSnapshot: detail.currentPrice,
      });
      continue;
    }

    if (item.unitPriceSnapshot !== detail.currentPrice) {
      hasDrift = true;
      updates.push({
        productId: item.productId,
        variantId: item.variantId,
        unitPriceSnapshot: detail.currentPrice,
      });
    }
  }

  return { hasDrift, updates };
}
