const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const INR_COMPACT = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** ₹1,29,999 — Indian digit grouping, no paise. */
export function formatCurrency(amount: number): string {
  return INR.format(amount);
}

/** ₹1.3L — for tight spaces such as chips and badges. */
export function formatCurrencyCompact(amount: number): string {
  return INR_COMPACT.format(amount);
}

export function formatPercent(fraction: number): string {
  return `${(fraction * 100).toFixed(2).replace(/\.00$/, "")}%`;
}

export function discountPercent(price: number, mrp: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

/** 12000 -> "12,000"; used where the ₹ symbol is rendered separately. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN").format(value);
}
