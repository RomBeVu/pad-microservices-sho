import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import './ProductView.css';

const ProductView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to add items to cart.');

    const userId = JSON.parse(atob(token.split('.')[1])).userId;
    dispatch(addToCart({ userId, productId: id, quantity: 1 }));
  };

  if (loading || !selected) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="product-view-container">
      <h2>{selected.name}</h2>
      <p>{selected.description}</p>
      <p>Price: ₹{selected.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <br />
      <Link to="/products">← Back to Product List</Link>
    </div>
  );
};

export default ProductView;
