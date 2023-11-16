import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token') || null;

    if (!token) {
      navigate('/login');
    } else {
      axios.get('https://server-d4tn.onrender.com/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user information:', error);
      });
    }
  }, [navigate]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="container mt-4">
      {userData ? (
        <h2 className="text-center">
          ¡Bienvenido, {userData.firstName && capitalizeFirstLetter(userData.firstName)}{' '}
          {userData.lastName && capitalizeFirstLetter(userData.lastName)}!
          Has iniciado sesión correctamente.
        </h2>
      ) : (
        <p className="text-center">Cargando información del usuario...</p>
      )}
    </div>
  );
};

export default Home;
