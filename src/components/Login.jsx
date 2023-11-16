import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://server-d4tn.onrender.com/login', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      Cookies.set('token', token, { expires: 0.5 });
      navigate('/home');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);      
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: 'Verifica tus credenciales e intenta nuevamente.',
      }); 
    }
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-3 col-md-6 col-sm-10 mx-auto">
          <div className="card mt-5 border border-primary" style={{ borderWidth: 0 }}>
            <h2 className="text-center p-3 bg-primary text-white w-100">Iniciar Sesión</h2>
            <div className="card-body">
              {error && <p className="error">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuario"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Iniciar Sesión</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
