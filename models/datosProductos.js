const mongoose = require("mongoose");
const validator = require ("validator");

//Esquema del usuario

const productosModelo = new mongoose .Schema({
    /*  *** Campos con su respectiva validacion *** */
    //NOMBRE
    username: {
      type: String,
      required: true,
      minlength: 3,  
    },
    //PRECIO
    precio: {
        type: Number,
        required: true,
        minlength: 3, 
      },
    //CANTIDAD
    cantidad: {
        type: Number,
        required: true,
        minlength: 3, 
      },



    /* createdAt: { type: Date, default: Date.now }, */
  });



  const datosProductos = mongoose.models.Producto || mongoose.model("Producto", productosModelo);

  module.exports = datosProductos;