import React, { useEffect} from 'react';
import {  Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { getUserInfo } from './Redux/Actions/index'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import ProductCrud from '../src/components/CrudProductos'
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import Pedidos from './components/Pedidos';
import VentasVendedor from './components/Ventas';
import Footer from './components/Footer'

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  return (
      <div className="App">
        <header className="App-header">
          <Navbar/>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute canActivate={false} redirectPath="/home" />} >
            <Route path="/admin" element={<ProductCrud />} />
            <Route path="/ventas" element={<VentasVendedor />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pedidos" element={<Pedidos />} />
          
        </Routes>
        {!(location.pathname === '/login' || location.pathname === '/register') && <Footer />}              </div>
    
  );
}

export default App;