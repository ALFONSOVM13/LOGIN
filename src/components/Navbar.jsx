import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../styles/navbar.scss'
import { Button } from 'react-bootstrap';

function CustomNavbar({ userRole }) {
  const navigate = useNavigate();


  const handleLogout = () => {
    Cookies.remove('token');
    sessionStorage.clear();
    navigate('/', { replace: true });
  };

  const token = Cookies.get('token');

  return (
    <nav className="navbar" style={{ backgroundColor: '#000000' }}>
      <div className="navbar-container">
        <div className="navbar-links">
          <NavLink to="/home" className="link" activeClassName="active">
            Inicio
          </NavLink>

          {token && (
            <NavLink to="/pedidos" className="link">
              Mi cuenta
            </NavLink>
          )}
          {token && userRole !== 'cliente'  && (
            <>
              <NavLink to="/admin" className="link">
                Admin
              </NavLink>
              <NavLink to="/ventas" className="link">
                Ventas
              </NavLink>
            </>
          )}

          {!token ? (
            <>
              <NavLink to="/login" className="link">
                Login
              </NavLink>
              <NavLink to="/register" className="link">
                Register
              </NavLink>
            </>
          ) : (
              <Button  onClick={handleLogout} to="/" className="logout">
                Cerrar Sesión
              </Button>

            
          )}
        </div>
      </div>
    </nav>
  );
}

export default CustomNavbar;