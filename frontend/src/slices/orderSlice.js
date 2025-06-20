import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const placeOrder = createAsyncThunk(
  'orders/place',
  async ({ userId, token, items }) => {
    const res = await fetch(`${process.env.REACT_APP_ORDER_URL}/orders/${userId}/place`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, items }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order placement failed');
    return data;
  }
);

export const fetchOrders = createAsyncThunk('orders/fetch', async ({ userId }) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.REACT_APP_ORDER_URL}/orders/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  }
});

export default orderSlice.reducer;
