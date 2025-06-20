import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../slices/orderSlice';
import { resetCart } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: orders, loading, error } = useSelector((state) => state.orders);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(resetCart());
    }, 3000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (!token) return navigate('/login');
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUsername(payload.username);
    dispatch(fetchOrders({ userId:payload.userId, token }));
  }, [dispatch, token, navigate]);

  const handleStatusChange = (orderId, status) => {
    fetch(`${process.env.REACT_APP_ORDER_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(data => {
        dispatch(fetchOrders({ userId: JSON.parse(atob(token.split('.')[1])).userId, token }));
      })
      .catch(err => console.error('Failed to update order status:', err));
  };


  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">Your Orders</h2>
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No orders placed yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-card">
              <h4>Order ID: {order._id}</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    <p>Product ID: {item.productId}</p>
                    <p>Quantity: {item.quantity}</p>
                  </li>
                ))}
              </ul>
              
              {username === 'admin'?
                <div className="admin-status-update">
                  <label htmlFor={`status-${order._id}`}>Update Status:</label>
                  <select
                    id={`status-${order._id}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              :<p className="order-status">Status: {order.status}</p>}
              <p className="order-timestamp">Placed On: {new Date(order.placedAt).toLocaleString()}</p>
              <p className="order-timestamp">Shipped On: {order.shippedAt ? new Date(order.shippedAt).toLocaleString() : 'Pending'}</p>
              <p className="order-timestamp">Delivered On: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'Pending'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
