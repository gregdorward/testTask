/**
 * Pricing logic for the cart and checkout. Kept in one place so every screen
 * calculates totals identically.
 */

const SHIPPING_FLAT = 5.0;

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate the discount for a given coupon against a subtotal.
 *
 * Supported coupon: "WARACLE25" (case-insensitive) — 25% off the subtotal.
 */
export function calculateDiscount(couponCode: string | undefined, subtotal: number): number {
  let discount = 0;

  if (String(couponCode || '').trim().toUpperCase() === 'WARACLE25') {
    // 25% off the subtotal.
    discount = 0.25;
  }

  if (discount > subtotal) discount = subtotal;
  return round2(discount);
}

export interface LineLike {
  price: number;
  quantity: number;
}

export function calculateTotals(items: LineLike[], couponCode?: string) {
  const subtotal = round2(items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const discount = calculateDiscount(couponCode, subtotal);
  const shipping = subtotal > 0 ? SHIPPING_FLAT : 0;
  const total = round2(subtotal - discount + shipping);
  return { subtotal, discount, shipping, total };
}
