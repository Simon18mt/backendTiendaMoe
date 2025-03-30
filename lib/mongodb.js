// impoetamos "mongoose" para realizar la conexion a mongoDB
const mongoose = require("mongoose");

//con funa funcion asincrincrona realizar la conexion
const conectarDB = async () => {

  //bloque de codigo que queremos ejecutar
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    // Si la conexión es exitosa
    console.log("MongoDB conectado");
  } 
  //en caso de lagun error con el "try" pasaremos al "catch"
  catch (err) {
    //manejo de errores 
    console.error("Error de conexión a MongoDB:", err.message);
    throw new Error("Error de conexión a MongoDB");
  }
};

module.exports = conectarDB;
