import type { ICartItem } from '../type/cart-type';

const toNumber = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getCartItemPriceInfo = (item: ICartItem) => {
  const originalPrice = toNumber(item.price);
  const finalPrice = toNumber(item.final_price);
  const hasDiscount = item.discount && finalPrice > 0 && finalPrice < originalPrice;

  const discountPercent = hasDiscount
    ? ((originalPrice - finalPrice) / originalPrice) * 100
    : 0;

  const effectivePrice = hasDiscount ? finalPrice : originalPrice;

  return {
    effectivePrice,
    originalPrice,
    hasDiscount,
    discountPercent: discountPercent > 0 ? discountPercent : 0,
  };
};
