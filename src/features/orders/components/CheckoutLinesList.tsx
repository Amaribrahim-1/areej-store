"use client";

import type { CheckoutLineItemData } from "../types";
import CheckoutLineItem from "./CheckoutLineItem";

type CheckoutLinesListProps = {
  lines: CheckoutLineItemData[];
};

export default function CheckoutLinesList({ lines }: CheckoutLinesListProps) {
  return (
    <ul className="flex list-none flex-col p-0" role="list">
      {lines.map((line) => (
        <li key={`${line.productId}:${line.variantId}`}>
          <CheckoutLineItem line={line} />
        </li>
      ))}
    </ul>
  );
}
