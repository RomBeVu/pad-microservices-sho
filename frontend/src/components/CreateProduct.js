import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateProduct.css';

const CreateProduct = () => {
  const [form, setForm] = useState({ name: '', price: '', description: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  let username = '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    username = payload.username;
  } catch (err) {
    console.error('Invalid token');
  }

  if (username !== 'admin') {
    return <p style={{ padding: '1rem', color: 'red' }}>Access denied</p>;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      if (file) formData.append('image', file);

      const response = await fetch(`${process.env.REACT_APP_PRODUCT_URL}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create product');
      const data = await response.json();
      setSuccess(`Product "${data.name}" created`);
      setForm({ name: '', price: '', description: '' });
      setFile(null);

      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-product-container">
      <h2>Create Product</h2>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}
      <form onSubmit={handleSubmit} className="create-product-form" encType="multipart/form-data">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateProduct;
