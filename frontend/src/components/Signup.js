import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup(form)).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f4f4'
    }}>
      <div style={{
        padding: '2rem',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '300px'
      }}>
        <h2 style={{ textAlign: 'center' }}>Signup</h2>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type='text'
            name='username'
            value={form.username}
            onChange={handleChange}
            placeholder='Username'
            required
          />
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='Email'
            required
          />
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
            placeholder='Password'
            required
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );

};

export default Signup;
