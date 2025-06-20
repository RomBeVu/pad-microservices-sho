import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// === Async Thunks ===

export const getCart = createAsyncThunk('cart/get', async (userId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.REACT_APP_CART_URL}/cart/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch cart');
  return data;
});

export const addToCart = createAsyncThunk('cart/add', async ({ userId, productId, quantity }) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.REACT_APP_CART_URL}/cart/${userId}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add to cart');
  return data;
});

export const removeFromCart = createAsyncThunk('cart/remove', async ({ userId, productId }) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.REACT_APP_CART_URL}/cart/${userId}/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to remove item');
  return data;
});

export const clearCart = createAsyncThunk('cart/clear', async (userId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.REACT_APP_CART_URL}/cart/${userId}/clear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to clear cart');
  return data;
});

export const checkoutCart = createAsyncThunk('cart/checkout', async (userId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.REACT_APP_CART_URL}/cart/${userId}/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Checkout failed');
  return data;
});

// === Slice ===

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    checkedOut: false,
  },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.checkedOut = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
      })

      // Remove
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
      })

      // Clear
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
        state.loading = false;
      })

      // Checkout
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.checkedOut = true;
        state.items = [];
        state.loading = false;
      })

      // Common Loading/Error for all
      .addMatcher(action => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        })
      .addMatcher(action => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
  }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
