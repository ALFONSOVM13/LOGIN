import { GET_USERINFO } from './actions-types';
import axios from 'axios';
import Cookies from 'js-cookie';

export const getUserInfo = () => {
  return async (dispatch) => {
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
          dispatch({ 
            type: GET_USERINFO, 
            payload: { userData} });
        }
      }
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
    }
  };
};
