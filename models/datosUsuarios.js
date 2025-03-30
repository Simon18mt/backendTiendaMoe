const mongoose = require("mongoose");
const validator = require ("validator");

// Esquema del carrito (se usará dentro del usuario)
const carritoModelo = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
/*   total: {
    type: Number,
    required: true,
  }, */

});

// ******************** Esquema del usuario ********************

const usuarioModelo = new mongoose .Schema({
    /*  *** Campos con su respectiva validacion *** */
    //NOMBRE
    username: {
      type: String,
      required: true,
 
      minlength: 3, // username tenga al menos 3 caracteres
    },
    //CORREO
    email: {
      type: String,
      // El correo es obligatorio
      required: [true, "El correo electrónico es obligatorio"],
      unique: true, // el correo sea único
      validate: {
        validator: function (value) {
          // Usamos validator para validar el correo
          return validator.isEmail(value);
        },
        // si no es un correo válido
        message: "Por favor, ingresa un correo electrónico válido",
      },
    },
    //CONTRASEÑA
    password: {
      type: String,
      required: true,
      minlength: 3, // Contraseña de al menos 3 carácter
    },
    //TIPO DE USUARIO
    userType: {
      type: String,
      required: true, 
    },
    compraCancelada: {
      type: Boolean,
      default: false,
    },
      // CARRITO (solo si userType es "usuario")
    carrito: {
      type: [carritoModelo], // Usa el esquema de carrito dentro de un array
      default: function () {
      return this.userType === "usuario" ? [] : undefined;
    },
  },
    
  });



  const listadoUsuarios = 
  mongoose .models.listadoUsuarios || 
  mongoose.model("listadoUsuarios", usuarioModelo);

  // Exportar el modelo para poder utilizarlo en otras partes de la aplicación
  module.exports = listadoUsuarios;