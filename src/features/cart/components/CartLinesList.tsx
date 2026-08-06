"use client";

import type { CartLineItemData } from "../types";
import CartLineItem from "./CartLineItem";

type CartLinesListProps = {
  lines: CartLineItemData[];
  onQuantityChange: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;
  onRemove: (productId: string, variantId: string) => void;
};

export default function CartLinesList({
  lines,
  onQuantityChange,
  onRemove,
}: CartLinesListProps) {
  return (
    <ul className="flex list-none flex-col p-0" role="list">
      {lines.map((line) => (
        <CartLineRow
          key={`${line.productId}:${line.variantId}`}
          line={line}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}

type CartLineRowProps = {
  line: CartLineItemData;
  onQuantityChange: CartLinesListProps["onQuantityChange"];
  onRemove: CartLinesListProps["onRemove"];
};

function CartLineRow({ line, onQuantityChange, onRemove }: CartLineRowProps) {
  function handleQuantityChange(quantity: number) {
    onQuantityChange(line.productId, line.variantId, quantity);
  }

  function handleRemove() {
    onRemove(line.productId, line.variantId);
  }

  return (
    <li>
      <CartLineItem
        line={line}
        onQuantityChange={handleQuantityChange}
        onRemove={handleRemove}
      />
    </li>
  );
}
