import type { Product } from "@/lib/types";

/**
 * Checks if a product's discount is currently active.
 * @param product The product to check.
 * @returns True if the discount is active, false otherwise.
 */
export function isDiscountActive(product: Product | null | undefined): boolean {
  if (!product?.is_discount_active || !product.discount_percentage) {
    return false;
  }

  const now = new Date();
  const startDate = product.discount_start_date ? new Date(product.discount_start_date) : null;
  const endDate = product.discount_end_date ? new Date(product.discount_end_date) : null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (startDate) {
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    if (today < startDay) return false;
  }
  if (endDate) {
    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    if (today > endDay) return false;
  }
  return true;
}

/**
 * Gets the base price of a product, prioritizing the first variant's price.
 * @param product The product.
 * @returns The base price.
 */
export function getBasePrice(product: Product | null | undefined): number {
  if (!product) return 0;
  
  const priceFromVariant = product.variants && product.variants.length > 0
    ? product.variants[0].price
    : 0;
  
  if (priceFromVariant > 0) return priceFromVariant;

  // Fallback for older data structures that might only have priceRange
  return product.priceRange ? Number.parseInt(product.priceRange.replace(/\./g, "")) : 0;
}

/**
 * Calculates the discounted price if a discount is active.
 * @param product The product.
 * @returns The discounted price, or the base price if no discount is active.
 */
export function getDiscountedPrice(product: Product | null | undefined): number {
  const originalPrice = getBasePrice(product);
  if (isDiscountActive(product) && product?.discount_percentage) {
    return Math.round(originalPrice * (1 - product.discount_percentage / 100));
  }
  return originalPrice;
} 