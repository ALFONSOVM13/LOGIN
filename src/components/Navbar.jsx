import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../styles/navbar.scss'
import { Button } from 'react-bootstrap';
import {useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../Redux/Actions/index';




function CustomNavbar() {
  const navigate = useNavigate();
  const userRole = useSelector(state => state.userData?.Role || 'defaultRole');
    const dispatch = useDispatch();




  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);


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
          {token && userRole !== 'cliente' && (
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
            <Button onClick={handleLogout} to="/" className="logout">
              Cerrar Sesión
            </Button>


          )}
        </div>
      </div>
    </nav>
  );
}

export default CustomNavbar;