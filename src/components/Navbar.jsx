// CustomNavbar.js
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../Redux/Actions/index';
import '../styles/navbar.scss';

function CustomNavbar() {
  const userRole = useSelector(state => state.userData?.Role || 'defaultRole');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);


  const token = Cookies.get('token');

  return (
    <nav className="navbar" style={{ backgroundColor: '#3481be' }}>
      <div className="navbar-container">
        <div className="navbar-links">
          <NavLink to="/home" className="link" activeClassName="active">
            Tienda
          </NavLink>
          <NavLink to="/moviles" className="link" activeClassName="active">
            Moviles y Tablets
          </NavLink>
          <NavLink to="/equipos" className="link" activeClassName="active">
            Equipos Armados
          </NavLink>

          <NavLink to="/portatiles" className="link" activeClassName="active">
            Portatiles
          </NavLink>
          <NavLink to="/servicios" className="link" activeClassName="active">
            Servicios
          </NavLink>
          <NavLink to="/servicios" className="link" activeClassName="active">
            Nosotros
          </NavLink>
          <NavLink to="/portatiles" className="link" activeClassName="active">
            Contactanos
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
        </div>
      </div>
    </nav>
  );
}

export default CustomNavbar;
