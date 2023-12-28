import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../assets/logo.png'
import '../styles/navbar.scss'

const Topbar = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const handleLogout = () => {
    Cookies.remove('token');
    sessionStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink to="/home" className="navbar-brand">
          <img className='logo' src={logo} alt="logo"/>
        </NavLink>
        <form className="d-flex">
          <input className="form-control me-2" type="search" placeholder="¿Ya sabes lo que necesitas? Búscalo aquí..." aria-label="Search" style={{ width: '400px' }} />
          <button className="btn" type="submit">🔍</button>
        </form>
        <div className="navbar-nav ms-auto">
          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#userMenu" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-person"></i> {token ? '👤 USUARIO' : '👤 INGRESAR'}
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              {!token ? (
                <>
                  <li><NavLink className="dropdown-item" to="/login">Iniciar sesión</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/register">Registrarse</NavLink></li>
                </>
              ) : (
                <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
