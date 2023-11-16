import React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomNavbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <Navbar expand="lg" bg="light">
      <Navbar.Brand as={NavLink} to="/home">Home</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        <Nav className="ml-auto">
          {token ? (
            <Nav.Item>
              <Button variant="link" onClick={handleLogout}>Logout</Button>
            </Nav.Item>
          ) : (
            <>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </Nav.Item>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CustomNavbar;
