# Guest Local Cart — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow unauthenticated users to add products to cart via localStorage and sync to server on login.

**Architecture:** Unified Redux store — cart thunks auto-route to localStorage (guest) or API (authenticated) based on `state.auth.user`. A `localCartService` utility wraps all localStorage operations. On login, local cart is synced to server via existing `POST /api/cart/sync`, then cleared.

**Tech Stack:** React 19, Redux Toolkit, TypeScript, Axios, localStorage

## Global Constraints

- Feature folders limited to: `api/`, `constants/`, `pages/`, `store/`, `type/`
- Shared utilities in `src/share/lib/`
- localStorage key: `shoplen_guest_cart` (from `cart-constants.ts`)
- `MAX_QUANTITY_PER_ITEM: 99`, `MIN_QUANTITY_PER_ITEM: 1`
- ICartItem type reused for both local and server cart data
- Backend `POST /api/cart/sync` accepts `{local_cart: ISyncCartPayload[]}` and merges via `ON CONFLICT DO UPDATE SET so_luong = so_luong + EXCLUDED.so_luong`

---

### Task 1: localStorage Cart Service

**Files:**
- Create: `src/share/lib/local-cart.ts`

**Interfaces:**
- Consumes: `ICartItem` (`features/Cart/type/cart-type.ts`), `ISyncCartPayload` (`features/Cart/type/cart-type.ts`), `CART_CONSTANTS.LOCAL_STORAGE_KEY` (`features/Cart/constants/cart-constants.ts`)
- Produces: `getLocalCart()`, `addToLocalCart()`, `removeFromLocalCart()`, `updateLocalQuantity()`, `clearLocalCart()`, `getLocalSyncPayload()`, `hasLocalItems()`

- [ ] **Step 1: Create local-cart.ts**

```typescript
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
  const existing = items.find(i => i.variant_id === item.variant_id);
  if (existing) {
    existing.quantity = Math.min(
      existing.quantity + item.quantity,
      CART_CONSTANTS.MAX_QUANTITY_PER_ITEM
    );
  } else {
    items.push({ ...item });
  }
  write(items);
};

export const removeFromLocalCart = (variant_id: number) => {
  write(read().filter(i => i.variant_id !== variant_id));
};

export const updateLocalQuantity = (variant_id: number, quantity: number) => {
  const items = read();
  const item = items.find(i => i.variant_id === variant_id);
  if (item) item.quantity = quantity;
  write(items);
};

export const clearLocalCart = () => {
  localStorage.removeItem(KEY);
};

export const getLocalSyncPayload = (): ISyncCartPayload[] =>
  read().map(i => ({ variant_id: i.variant_id, quantity: i.quantity }));
```

- [ ] **Step 2: Commit**

```bash
git add src/share/lib/local-cart.ts
git commit -m "feat: add localStorage cart service for guest users"
```

---

### Task 2: Dual-mode Redux Store (thunks + slice)

**Files:**
- Modify: `src/features/Cart/store/cart-thunk.ts`
- Modify: `src/features/Cart/store/cart-slice.ts`

**Interfaces:**
- Consumes: `getLocalCart()`, `addToLocalCart()`, `removeFromLocalCart()`, `updateLocalQuantity()` from Task 1; `RootState` from `app/redux/store.ts` (to read `state.auth.user`)
- Produces: `addToCartThunk`, updated `fetchCart`/`updateItemQuantity`/`removeCartItem` (all branch by auth); `loadLocalCart` reducer

- [ ] **Step 1: Modify cart-thunk.ts — update `fetchCart` to branch for guest**

```typescript
// Add import
import { getLocalCart } from '@/share/lib/local-cart';
import type { RootState } from '@/app/redux/store';

// Replace existing fetchCart
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        if (!state.auth.user) {
            return getLocalCart();
        }
        try {
            const {data}: any = await cartApi.getCart();
            return data.cart;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi tải giỏ hàng');
        }
    }
);
```

- [ ] **Step 2: Modify cart-thunk.ts — add `addToCartThunk`**

```typescript
// Add import
import { addToLocalCart } from '@/share/lib/local-cart';
import type { RootState } from '@/app/redux/store';

// Add after removeCartItem
export const addToCartThunk = createAsyncThunk(
    'cart/addToCart',
    async (item: ICartItem, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        if (state.auth.user) {
            try {
                await cartApi.addToCart(item.variant_id, item.quantity);
                return item;
            } catch (error: any) {
                return rejectWithValue(error.response?.data?.message || 'Lỗi thêm vào giỏ hàng');
            }
        } else {
            addToLocalCart(item);
            return item;
        }
    }
);
```

- [ ] **Step 3: Modify cart-thunk.ts — update `updateItemQuantity` to branch for guest**

```typescript
// Add import
import { updateLocalQuantity } from '@/share/lib/local-cart';
import type { RootState } from '@/app/redux/store';

// Replace existing updateItemQuantity
export const updateItemQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ variant_id, quantity }: { variant_id: number; quantity: number }, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        if (!state.auth.user) {
            updateLocalQuantity(variant_id, quantity);
            return { variant_id, quantity };
        }
        try {
            await cartApi.updateQuantity(variant_id, quantity);
            return { variant_id, quantity };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi cập nhật số lượng');
        }
    }
);
```

- [ ] **Step 4: Modify cart-thunk.ts — update `removeCartItem` to branch for guest**

```typescript
// Add import
import { removeFromLocalCart } from '@/share/lib/local-cart';
import type { RootState } from '@/app/redux/store';

// Replace existing removeCartItem
export const removeCartItem = createAsyncThunk(
    'cart/removeItem',
    async (variant_id: number, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        if (!state.auth.user) {
            removeFromLocalCart(variant_id);
            return variant_id;
        }
        try {
            await cartApi.removeFromCart(variant_id);
            return variant_id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi xóa sản phẩm');
        }
    }
);
```

- [ ] **Step 5: Modify cart-slice.ts — add `loadLocalCart` reducer**

```typescript
// Add import
import { getLocalCart } from '@/share/lib/local-cart';

// Add to reducers object inside createSlice
reducers: {
    clearCartState: (state) => {
        state.items = [];
        state.error = null;
    },
    loadLocalCart: (state) => {
        state.items = getLocalCart();
    },
},

// Add to exports
export const { clearCartState, loadLocalCart } = cartSlice.actions;
```

- [ ] **Step 6: Modify cart-slice.ts — add `addToCartThunk` handling to extraReducers**

```typescript
// Add import
import { addToCartThunk, fetchCart, updateItemQuantity, removeCartItem, syncLocalCartToServer } from './cart-thunk';

// Add to extraReducers builder
.addCase(addToCartThunk.pending, (state) => {
    state.isLoading = true;
    state.error = null;
})
.addCase(addToCartThunk.fulfilled, (state, action) => {
    state.isLoading = false;
    const item = action.payload;
    const existing = state.items.find(i => i.variant_id === item.variant_id);
    if (existing) {
        existing.quantity += item.quantity;
    } else {
        state.items.push(item);
    }
})
.addCase(addToCartThunk.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
})
```

- [ ] **Step 7: Commit**

```bash
git add src/features/Cart/store/cart-thunk.ts src/features/Cart/store/cart-slice.ts
git commit -m "feat: dual-mode cart store - guest uses localStorage, auth uses API"
```

---

### Task 3: Sync Local Cart on Login + CartPage Guest Redirect

**Files:**
- Modify: `src/app/init/AppInit.tsx`
- Modify: `src/features/Cart/pages/CartPage.tsx`

**Interfaces:**
- Consumes: `hasLocalItems()`, `getLocalSyncPayload()`, `clearLocalCart()` from Task 1; `syncLocalCartToServer`, `fetchCart`, `loadLocalCart` from Task 2; `useAppSelector(state => state.auth.user)` for guest check

- [ ] **Step 1: Modify AppInit.tsx — add cart sync logic**

```typescript
// Add imports
import { hasLocalItems, getLocalSyncPayload, clearLocalCart } from '@/share/lib/local-cart';
import { syncLocalCartToServer, fetchCart } from '@/features/Cart/store/cart-thunk';
import { loadLocalCart } from '@/features/Cart/store/cart-slice';

// Replace the existing useEffect
useEffect(() => {
    const token = localStorage.getItem('accessToken');

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
}, [dispatch]);
```

- [ ] **Step 2: Modify CartPage.tsx — add `user` check for checkout button**

```typescript
// Add import
import { useAppSelector } from '@/app/redux/hooks';

// Add inside the CartPage component, after existing hooks
const { user } = useAppSelector((state) => state.auth);

// Replace the "Tiến hành thanh toán" button
<Button
    type="primary"
    size="large"
    block
    href={user ? "/checkout" : "/auth/login"}
    className="font-medium bg-blue-600 rounded-lg hover:bg-blue-700 h-12 text-base border-none"
>
    {user ? "Tiến hành thanh toán" : "Đăng nhập để thanh toán"}
</Button>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/init/AppInit.tsx src/features/Cart/pages/CartPage.tsx
git commit -m "feat: sync local cart on login; redirect guest checkout to login"
```

---

## Summary of Changes

| File | Action |
|------|--------|
| `src/share/lib/local-cart.ts` | Create |
| `src/features/Cart/store/cart-thunk.ts` | Modify (4 thunks) |
| `src/features/Cart/store/cart-slice.ts` | Modify (1 reducer, 1 extraReducer) |
| `src/features/Cart/pages/CartPage.tsx` | Modify (checkout button) |
| `src/app/init/AppInit.tsx` | Modify (sync on login) |
