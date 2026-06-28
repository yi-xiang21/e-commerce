# Guest Local Cart — Design Spec

## Overview

Allow **unauthenticated users (guests)** to add products to cart via `localStorage`.
When the user logs in, the local cart is synced to the server and the local copy is cleared.

## Architecture: Unified Redux Store (Approach A)

A single Redux cart-slice handles both local (guest) and server (authenticated) sources.
Thunks automatically route to `localStorage` or the API based on `state.auth.user`.

## Data Layer

### `src/share/lib/local-cart.ts` (new)

Utility wrapping localStorage read/write under key `shoplen_guest_cart`.

```typescript
getLocalCart(): ICartItem[]
addToLocalCart(item: ICartItem)          // merge by variant_id (add qty if exists)
removeFromLocalCart(variant_id: number)
updateLocalQuantity(variant_id: number, qty: number)
clearLocalCart()
getLocalSyncPayload(): ISyncCartPayload[] // {variant_id, quantity}[]
hasLocalItems(): boolean
```

Uses `ICartItem` from `features/Cart/type/cart-type.ts` — no type changes needed.

## Redux Layer

### Thunks (`features/Cart/store/cart-thunk.ts`)

| Thunk | Auth state | Action |
|-------|-----------|--------|
| `fetchCart` | has user | `GET /api/cart` |
| " | guest | `localCartService.getLocalCart()` → return items |
| `addToCartThunk` (NEW) | has user | `POST /api/cart` |
| " | guest | `localCartService.addToLocalCart(item)` |
| `updateItemQuantity` | has user | `PUT /api/cart/:variant_id` |
| " | guest | `localCartService.updateLocalQuantity()` |
| `removeCartItem` | has user | `DELETE /api/cart/:variant_id` |
| " | guest | `localCartService.removeFromLocalCart()` |
| `syncLocalCartToServer` | (only runs when authenticated) | `POST /api/cart/sync` |

### Slice (`features/Cart/store/cart-slice.ts`)

New reducer:
```typescript
loadLocalCart: (state) => {
  state.items = localCartService.getLocalCart();
}
```

All existing `extraReducers` remain unchanged.

## Auth Integration

### `src/app/init/AppInit.tsx` (modified)

```typescript
if (token) {
  dispatch(getMeThunk()).then(() => {
    if (hasLocalItems()) {
      dispatch(syncLocalCartToServer(getLocalSyncPayload())).then(() => {
        clearLocalCart();
        dispatch(fetchCart());
      });
    } else {
      dispatch(fetchCart());
    }
  });
} else {
  dispatch(loadLocalCart());
  dispatch(markInitialized());
}
```

### Logout

`clearCartState` already exists in cart-slice — no change needed.

## Component Changes

### `CartPage.tsx`

- Nút "Tiến hành thanh toán": nếu guest → `/auth/login`
- `fetchCart()` on mount → giữ nguyên (thunk tự rẽ nhánh)

### `Header.tsx`

- Không cần sửa (đã đọc `state.cart.items`)

### `ProductCard.tsx` / future Shop page

- Gọi `dispatch(addToCartThunk(item))` với `item` là `ICartItem`

## Edge Cases

| Case | Handling |
|------|----------|
| Guest adds → login → existing server cart | Backend `syncLocalCart` uses `ON CONFLICT DO UPDATE SET so_luong = so_luong + EXCLUDED.so_luong` (merge) |
| Out of stock during sync | Backend caps to available stock |
| Invalid variant_id | Backend skips the item |
| Quantity > 99 | UI enforced via `MAX_QUANTITY_PER_ITEM` constant |

## Files Changed

| File | Action |
|------|--------|
| `src/share/lib/local-cart.ts` | **NEW** |
| `src/features/Cart/store/cart-thunk.ts` | **EDIT** — add `addToCartThunk`, branch existing thunks |
| `src/features/Cart/store/cart-slice.ts` | **EDIT** — add `loadLocalCart` reducer |
| `src/features/Cart/pages/CartPage.tsx` | **EDIT** — checkout button routing |
| `src/app/init/AppInit.tsx` | **EDIT** — sync local→server on login |
