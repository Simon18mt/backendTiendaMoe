// /models/registroDTO.js
const validator = require ("validator"); // para validar el correo
/* 
Este DTO es específico para guardar los datos en MongoDB.
*/
class LoginDTO {
  constructor(email, password,  ) {
   
    this.email = email;
    this.password = password;
     
  }

  // Método para crear el DTO a partir del cuerpo de la solicitud
  static fromRequestBody(body) {
    return new LoginDTO( body.email, body.password, );
  }

  // ************** Método para validar los datos **************
  static validate(loginDTO) {
    const errores = [];


    // Validación del correo electrónico
    if (!loginDTO.email || loginDTO.email.trim() === "") {
      // Aquí se usa registroDTO.email
      errores.push("El correo electrónico es obligatorio");
    } else if (!validator.isEmail(loginDTO.email)) {
      // Usamos validator para validar el correo
      errores.push("El correo electrónico no tiene un formato válido");
    }

    // Validación de la contraseña
    if (!loginDTO.password || loginDTO.password.length < 2) {
      errores.push("La contraseña debe tener al menos 4 caracteres");
    }
 
    return errores;
  }
}
module.exports = LoginDTO;
