import { describe, it, expect, beforeEach } from 'vitest';
import {
  getLocalCart,
  addToLocalCart,
  removeFromLocalCart,
  updateLocalQuantity,
  clearLocalCart,
  getLocalSyncPayload,
  hasLocalItems,
} from '../local-cart';
import type { ICartItem } from '@/features/Cart/type/cart-type';

const store = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  },
  configurable: true,
  writable: true,
});

const makeItem = (overrides: Partial<ICartItem> = {}): ICartItem => ({
  cart_id: 0,
  variant_id: 1,
  quantity: 1,
  sku: 'TEST-SKU',
  slug: 'test-product',
  original_price: '100000',
  price: '90000',
  color: 'Đen',
  size: 'M',
  product_id: 1,
  product_name: 'Test Product',
  stock_quantity: 10,
  image_url: '/test.jpg',
  ...overrides,
});

describe('local-cart', () => {
  beforeEach(() => {
    store.clear();
  });

  describe('getLocalCart', () => {
    it('returns empty array when localStorage is empty', () => {
      expect(getLocalCart()).toEqual([]);
    });

    it('returns parsed items when localStorage has data', () => {
      const item = makeItem();
      localStorage.setItem('shoplen_guest_cart', JSON.stringify([item]));
      expect(getLocalCart()).toEqual([item]);
    });

    it('returns empty array on corrupted JSON', () => {
      localStorage.setItem('shoplen_guest_cart', 'not-json');
      expect(getLocalCart()).toEqual([]);
    });
  });

  describe('hasLocalItems', () => {
    it('returns false when cart is empty', () => {
      expect(hasLocalItems()).toBe(false);
    });

    it('returns true when cart has items', () => {
      addToLocalCart(makeItem());
      expect(hasLocalItems()).toBe(true);
    });
  });

  describe('addToLocalCart', () => {
    it('adds a new item when variant_id does not exist', () => {
      addToLocalCart(makeItem({ variant_id: 1 }));
      const cart = getLocalCart();
      expect(cart).toHaveLength(1);
      expect(cart[0].variant_id).toBe(1);
    });

    it('merges quantity when same variant_id exists', () => {
      addToLocalCart(makeItem({ variant_id: 1, quantity: 2 }));
      addToLocalCart(makeItem({ variant_id: 1, quantity: 3 }));
      const cart = getLocalCart();
      expect(cart).toHaveLength(1);
      expect(cart[0].quantity).toBe(5);
    });

    it('caps quantity at MAX_QUANTITY_PER_ITEM (99)', () => {
      addToLocalCart(makeItem({ variant_id: 1, quantity: 90 }));
      addToLocalCart(makeItem({ variant_id: 1, quantity: 20 }));
      const cart = getLocalCart();
      expect(cart[0].quantity).toBe(99);
    });

    it('does not mutate the original item object', () => {
      const item = makeItem({ variant_id: 1, quantity: 2 });
      addToLocalCart(item);
      item.quantity = 999;
      const cart = getLocalCart();
      expect(cart[0].quantity).toBe(2);
    });
  });

  describe('removeFromLocalCart', () => {
    it('removes item by variant_id', () => {
      addToLocalCart(makeItem({ variant_id: 1 }));
      addToLocalCart(makeItem({ variant_id: 2 }));
      removeFromLocalCart(1);
      const cart = getLocalCart();
      expect(cart).toHaveLength(1);
      expect(cart[0].variant_id).toBe(2);
    });

    it('does nothing when variant_id does not exist', () => {
      addToLocalCart(makeItem({ variant_id: 1 }));
      removeFromLocalCart(999);
      expect(getLocalCart()).toHaveLength(1);
    });
  });

  describe('updateLocalQuantity', () => {
    it('updates quantity for existing item', () => {
      addToLocalCart(makeItem({ variant_id: 1, quantity: 2 }));
      updateLocalQuantity(1, 10);
      const cart = getLocalCart();
      expect(cart[0].quantity).toBe(10);
    });

    it('does nothing when variant_id does not exist', () => {
      addToLocalCart(makeItem({ variant_id: 1 }));
      updateLocalQuantity(999, 10);
      expect(getLocalCart()).toHaveLength(1);
    });
  });

  describe('clearLocalCart', () => {
    it('removes all items from localStorage', () => {
      addToLocalCart(makeItem({ variant_id: 1 }));
      addToLocalCart(makeItem({ variant_id: 2 }));
      clearLocalCart();
      expect(getLocalCart()).toEqual([]);
    });
  });

  describe('getLocalSyncPayload', () => {
    it('returns ISyncCartPayload[] format', () => {
      addToLocalCart(makeItem({ variant_id: 1, quantity: 3 }));
      addToLocalCart(makeItem({ variant_id: 2, quantity: 5 }));
      const payload = getLocalSyncPayload();
      expect(payload).toEqual([
        { variant_id: 1, quantity: 3 },
        { variant_id: 2, quantity: 5 },
      ]);
    });
  });
});
