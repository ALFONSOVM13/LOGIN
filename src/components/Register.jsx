import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import '../App.css';



const Register = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Cedula, setCedula] = useState('');
  const [Phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(true)
  const [errors, setErrors] = useState({
    Email: '',
    Username: '',
    Password: '',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;




  const handleEmailChange = (value) => {
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      Email: value.trim() !== '' ? (emailRegex.test(value) ? '' : 'Por favor, introduce un correo electrónico válido') : 'Por favor, complete el campo de correo electrónico',
      general: '',
    }));
  }



  const handleCedulaChange = (value) => {
    setCedula(value);
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      Username: value.trim() !== '' ? (usernameRegex.test(value) ? '' : 'El nombre de usuario solo puede contener letras y números') : 'Por favor, complete el campo de nombre de usuario',
      general: '',
    }));
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      Password: value.trim() !== '' ? (passwordRegex.test(value) ? '' : 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número') : 'Por favor, complete el campo de contraseña',
      general: '',
    }));
  };

  const handleFirstNameChange = (value) => {
    setFirstName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      FirstName: value.trim() !== '' ? '' : 'Por favor, complete el campo de nombre',
      general: '',
    }));
  };

  const handleLastNameChange = (value) => {
    setLastName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      LastName: value.trim() !== '' ? '' : 'Por favor, complete el campo de apellido',
      general: '',
    }));
  };


  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(Password)) {
      setErrors({ ...errors, Password: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número' });
      return;
    }
  

    let newErrors = {};

    if (!Username || !Password || !FirstName || !LastName || !Email) {
      newErrors = { ...newErrors, general: 'Todos los campos son requeridos. Por favor, complétalos.' };
    } else {
      if (!Username) {
        newErrors = { ...newErrors, Username: 'Por favor, complete el campo de nombre de usuario' };
      }
      if (!Password) {
        newErrors = { ...newErrors, Password: 'Por favor, complete el campo de contraseña' };
      }
      if (!FirstName) {
        newErrors = { ...newErrors, FirstName: 'Por favor, complete el campo de nombre' };
      }
      if (!LastName) {
        newErrors = { ...newErrors, LastName: 'Por favor, complete el campo de apellido' };
      }
      if (!Email) {
        newErrors = { ...newErrors, Email: 'Por favor, complete el campo de correo electrónico' };
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors({ ...errors, ...newErrors });
      setIsValid(false); 
      return;
    }
    if (isValid) {
    
    try {
      const checkUserResponse = await axios.post('https://backendtienda.onrender.com/checkuser', {
        Username,
        Email,
      });

      if (checkUserResponse.data.exists) {
        Swal.fire({
          icon: 'warning',
          title: 'Usuario ya registrado',
          text: 'El usuario o el correo electrónico ya están registrados. Por favor, inicie sesión.',
        })
        return;
      }

      const response = await axios.post('https://backendtienda.onrender.com/register', {
        Cedula,
        Username,
        Password,
        FirstName,
        LastName,
        Email,
        Phone
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
    }catch (error) {
      setErrors({ ...errors, general: 'No se pudo completar el registro. Inténtelo de nuevo más tarde.' });
      console.error('Error en la solicitud:', error);
    }
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
                    value={Email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="Correo Electrónico"
                  />
                  {errors.Email && <p className="text-danger">{errors.Email}</p>}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={Username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="Usuario"

                  />
                  {errors.Username && <p className="text-danger">{errors.Username}</p>}
                </div>
                <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  value={Password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Contraseña"
                />

                {errors.Password && <p className="text-danger">{errors.Password}</p>}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={Cedula}
                    onChange={(e) => handleCedulaChange(e.target.value)}
                    placeholder="Cédula"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={FirstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    placeholder="Nombres"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={LastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    placeholder="Apellidos"
                  />
                </div>


                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={Phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="Teléfono"
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
