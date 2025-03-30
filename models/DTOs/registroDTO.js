// /models/registroDTO.js
const validator = require ("validator"); // para validar el correo
/* 
Este DTO es específico para guardar los datos en MongoDB.
*/
class RegistroDTO {
  constructor(username, email, password, userType) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.userType = userType;
  }

  // Método para crear el DTO a partir del cuerpo de la solicitud
  static fromRequestBody(body) {
    return new RegistroDTO(body.username, body.email, body.password, body.userType);
  }

  // ************** Método para validar los datos **************
  static validate(registroDTO) {
    const errores = [];

    // Validación del nombre
    if (!registroDTO.username || registroDTO.username.trim() === "") {
      errores.push("El nombre de usuario es obligatorio");
    }

    // Validación del correo electrónico
    if (!registroDTO.email || registroDTO.email.trim() === "") {
      // Aquí se usa registroDTO.email
      errores.push("El correo electrónico es obligatorio");
    } else if (!validator.isEmail(registroDTO.email)) {
      // Usamos validator para validar el correo
      errores.push("El correo electrónico no tiene un formato válido");
    }

    // Validación de la contraseña
    if (!registroDTO.password || registroDTO.password.length < 2) {
      errores.push("La contraseña debe tener al menos 4 caracteres");
    }

    // Validación del userType
    if (!registroDTO.userType || registroDTO.userType.trim() === "") {
      errores.push("El userType es obligatorio");
    }
    return errores;
  }
}
module.exports = RegistroDTO;
