import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

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
        return userData.Role; 
      }
    }
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
  }
  
  return null;
};

const ProtectedRoute = ({ redirectPath = '/' }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const role = await getUserInfo();
      setUserRole(role);
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (userRole === null || userRole === undefined) {
    return <Navigate to="/" replace />;
  }

  const canActivate = userRole === 'admin' || userRole === 'vendedor';

  return canActivate ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;