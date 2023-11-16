import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import '../App.css';



const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  const handleEmailChange = (value) => {
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: value.trim() !== '' ? (emailRegex.test(value) ? '' : 'Por favor, introduce un correo electrónico válido') : 'Por favor, complete el campo de correo electrónico',
      general: '',
    }));
  };
  
  const handleUsernameChange = (value) => {
    setUsername(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      username: value.trim() !== '' ? (usernameRegex.test(value) ? '' : 'El nombre de usuario solo puede contener letras y números') : 'Por favor, complete el campo de nombre de usuario',
      general: '',
    }));
  };
  
  const handlePasswordChange = (value) => {
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: value.trim() !== '' ? (passwordRegex.test(value) ? '' : 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número') : 'Por favor, complete el campo de contraseña',
      general: '',
    }));
  };

  const handleFirstNameChange = (value) => {
    setFirstName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      firstName: value.trim() !== '' ? '' : 'Por favor, complete el campo de nombre',
      general: '',
    }));
  };
  
  const handleLastNameChange = (value) => {
    setLastName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      lastName: value.trim() !== '' ? '' : 'Por favor, complete el campo de apellido',
      general: '',
    }));
  };


  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!username || !password || !firstName || !lastName || !email) {
      newErrors = { ...newErrors, general: 'Todos los campos son requeridos. Por favor, complétalos.' };
    } else {
      if (!username) {
        newErrors = { ...newErrors, username: 'Por favor, complete el campo de nombre de usuario' };
      }
      if (!password) {
        newErrors = { ...newErrors, password: 'Por favor, complete el campo de contraseña' };
      }
      if (!firstName) {
        newErrors = { ...newErrors, firstName: 'Por favor, complete el campo de nombre' };
      }
      if (!lastName) {
        newErrors = { ...newErrors, lastName: 'Por favor, complete el campo de apellido' };
      }
      if (!email) {
        newErrors = { ...newErrors, email: 'Por favor, complete el campo de correo electrónico' };
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    try {
      const checkUserResponse = await axios.post('https://server-d4tn.onrender.com/checkuser', {
        username,
        email,
      });

      if (checkUserResponse.data.exists) {
        Swal.fire({
          icon: 'warning',
          title: 'Usuario ya registrado',
          text: 'El usuario o el correo electrónico ya están registrados. Por favor, inicie sesión.',
        }).then(() => {
          navigate('/login');
        });
        return;
      }

      const response = await axios.post('https://server-d4tn.onrender.com/register', {
        username,
        password,
        firstName,
        lastName,
        email,
      });
      console.log(response.data);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu registro ha sido exitoso. Ahora puedes iniciar sesión.',
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          navigate('/login');
        }
      });
    } catch (error) {
      setErrors({ ...errors, general: 'No se pudo completar el registro. Inténtelo de nuevo más tarde.' });
      console.error('Error en la solicitud:', error);
    }
  };


  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-6 col-sm-10 mx-auto">
          <div className="card mt-5 border border-primary">
            <h2 className="text-center p-3 bg-primary text-white w-100%">Registro de Usuario</h2>
            <div className="card-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="Correo Electrónico"
                  />
                  {errors.email && <p className="text-danger">{errors.email}</p>}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="Usuario"
                    
                  />
                  {errors.username && <p className="text-danger">{errors.username}</p>}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Contraseña"
                  />
                  {errors.password && <p className="text-danger">{errors.password}</p>}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    placeholder="Nombres"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    placeholder="Apellidos"
                  />
                </div>
                {errors.general && <p className="text-danger fw-bold">{errors.general}</p>}

                <button type="submit" className="btn btn-primary btn-block">Registrarse</button>
                
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>



  );
};
export default Register;
