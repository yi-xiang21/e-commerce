import type { ICartItem, ISyncCartPayload } from '@/features/Cart/type/cart-type';
import { CART_CONSTANTS } from '@/features/Cart/constants/cart-constants';

const KEY = CART_CONSTANTS.LOCAL_STORAGE_KEY;

const read = (): ICartItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (items: ICartItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const getLocalCart = (): ICartItem[] => read();

export const hasLocalItems = (): boolean => read().length > 0;

export const addToLocalCart = (item: ICartItem) => {
  const items = read();
  const qty = Math.min(
    Math.max(item.quantity, CART_CONSTANTS.MIN_QUANTITY_PER_ITEM),
    CART_CONSTANTS.MAX_QUANTITY_PER_ITEM
  );
  const existing = items.find(i => i.variant_id === item.variant_id);
  if (existing) {
    existing.quantity = Math.min(
      existing.quantity + qty,
      CART_CONSTANTS.MAX_QUANTITY_PER_ITEM
    );
  } else {
    items.push({ ...item, quantity: qty });
  }
  write(items);
};

export const removeFromLocalCart = (variant_id: number) => {
  write(read().filter(i => i.variant_id !== variant_id));
};

export const updateLocalQuantity = (variant_id: number, quantity: number) => {
  const items = read();
  const item = items.find(i => i.variant_id === variant_id);
  if (item) {
    item.quantity = Math.min(
      Math.max(quantity, CART_CONSTANTS.MIN_QUANTITY_PER_ITEM),
      CART_CONSTANTS.MAX_QUANTITY_PER_ITEM
    );
  }
  write(items);
};

export const clearLocalCart = () => {
  localStorage.removeItem(KEY);
};

export const getLocalSyncPayload = (): ISyncCartPayload[] =>
  read().map(i => ({ variant_id: i.variant_id, quantity: i.quantity }));
