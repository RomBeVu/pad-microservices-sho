import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCart,
  removeFromCart,
  clearCart,
  checkoutCart
} from '../slices/cartSlice';
import { fetchProducts } from '../slices/productSlice';
import { placeOrder } from '../slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { list: products } = useSelector((state) => state.products);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/login');

    const userId = JSON.parse(atob(token.split('.')[1])).userId;
    dispatch(getCart(userId));
    dispatch(fetchProducts());
  }, [dispatch, token, navigate]);

  const handleRemove = (productId) => {
    const userId = JSON.parse(atob(token.split('.')[1])).userId;
    dispatch(removeFromCart({ userId, productId }));
  };

  const handleClear = () => {
    const userId = JSON.parse(atob(token.split('.')[1])).userId;
    dispatch(clearCart(userId));
  };

  const handleCheckout = () => {
    const userId = JSON.parse(atob(token.split('.')[1])).userId;
    const cartItems = items.map(({ productId, quantity }) => ({ productId, quantity }));

    dispatch(placeOrder({ userId, token, items: cartItems }))
      .unwrap()
      .then(() => {
        dispatch(checkoutCart(userId));
        navigate('/orders');
      })
      .catch((err) => {
        console.error('Order placement failed:', err);
      });
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;

  const mergedCartItems = items.map((item) => {
    const product = products.find((p) => p._id === item.productId);
    return { ...item, product };
  });

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      {mergedCartItems.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No items in cart.</p>
      ) : (
        <>
          <ul className="cart-list">
            {mergedCartItems.map((item) => (
              <li className="cart-item" key={item._id}>
                <h4>{item.product?.name || 'Unknown Product'}</h4>
                <p>Price: ₹{item.product?.price || 'N/A'}</p>
                <p>Quantity: {item.quantity}</p>
                <button onClick={() => handleRemove(item.productId)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-actions">
            <button onClick={handleClear}>Clear Cart</button>
            <button onClick={handleCheckout}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
