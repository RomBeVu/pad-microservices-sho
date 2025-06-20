import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import ProductList from './components/ProductList';
import ProductView from './components/ProductView';
import Cart from './components/Cart';
import Orders from './components/Orders';
import Signup from './components/Signup';
import Header from './components/Header';
import CreateProduct from './components/CreateProduct';
import socket from './socket';

function App() {

  useEffect(() => {
    socket.on('order.status', (payload) => {
      console.log("📡 Received WebSocket message:", payload);
      toast.info(`Order #${payload.orderId} status: ${payload.status}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });


    return () => {
      socket.off('order.status');
    };
  }, []);

  
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductView />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
