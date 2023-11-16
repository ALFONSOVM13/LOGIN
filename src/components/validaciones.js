// validaciones.js

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email).toLowerCase());
  };
  
  export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };
  

  
  export const validateName = (name) => {
    // Expresión regular para permitir letras mayúsculas y minúsculas, espacios y apóstrofes (máximo 30 caracteres)
    const nameRegex = /^[a-zA-Z' ]{1,30}$/;
    return nameRegex.test(name);
  };