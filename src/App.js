import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import ProductCrud from '../src/components/CrudProductos'
import './App.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import Pedidos from './components/Pedidos';
import VentasVendedor from './components/Ventas';
import Footer from './components/Footer'

function App() {
  const [userRole, setUserRole] = useState('');
  const location = useLocation();

  const getUserInfo = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const response = await axios.get('https://backendtienda.onrender.com/userinfo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data;
          sessionStorage.setItem('userData', JSON.stringify(userData));
          setUserRole(userData.Role);

        }
      }
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);




  return (
    
      <div className="App">
        <header className="App-header">
          <Navbar userRole={userRole} />
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute canActivate={false} redirectPath="/home" />} >
            <Route path="/admin" element={<ProductCrud />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/ventas" element={<VentasVendedor />} />
        </Routes>
        {!(location.pathname === '/login' || location.pathname === '/register') && <Footer />}              </div>
    
  );
}

export default App;