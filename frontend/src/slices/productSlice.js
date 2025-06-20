import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// === ASYNC THUNKS ===

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.REACT_APP_PRODUCT_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
  return data;
});


// Fetch single product by ID
export const fetchProductById = createAsyncThunk('products/fetchById', async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${process.env.REACT_APP_PRODUCT_URL}/products/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch product');
  return data;
});

// === SLICE ===
const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSelected } = productSlice.actions;
export default productSlice.reducer;
