import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) return null;

  let username = '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    username = payload.username;
  } catch (err) {
    console.error('Invalid token:', err);
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <div style={styles.leftNav}>
          <Link to="/products" style={styles.link}>Products</Link>
          <Link to="/cart" style={styles.link}>Cart</Link>
          <Link to="/orders" style={styles.link}>Orders</Link>
          {username === 'admin' && (
            <Link to="/create-product" style={styles.link}>Create Product</Link>
          )}
        </div>
        <div style={styles.rightNav}>
          <span style={styles.username}>Welcome, {username}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#333',
    padding: '1rem',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  leftNav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  rightNav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    background: 'red',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default Header;
