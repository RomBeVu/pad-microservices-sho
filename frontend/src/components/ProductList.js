import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (productId) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first.');

    const userId = JSON.parse(atob(token.split('.')[1])).userId;
    dispatch(addToCart({ userId, productId, quantity: 1 }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="product-list-container">
      <h2>Products</h2>
      <div className="product-grid">
        {list.map(product => (
          <div className="product-card" key={product._id}>
            <Link to={`/products/${product._id}`}>
              <h4 style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>
                {product.name}
              </h4>
            </Link>
            <p>₹{product.price}</p>
            <button onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
