import mongoDB from "../../lib/mongodb" 
import initMiddleware from "../../lib/init-middleware" 
import Cors from "cors"
import listadoUsuarios from "../../models/datosUsuarios"
import mongoose from "mongoose";


const cors = initMiddleware (
    Cors ({
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        origin: "http://localhost:4200", // Permitir solicitudes solo desde localhost:4200
    })
);

export default async function handler (req,res) {
    await cors (req, res);
    if(req.method !== "GET"){
        return res.status(404).json({message: "METODO INCORRECTO"})
    }

  // recibiremos un id del cuerpo de la solocitud
  const { idUser } = req.query; 

  if(!idUser){
    return res.status(400).json({error:'ID son requeridos' })
  }

    //para validar que el id esta en la base de datos
    //usamos mongoose para esta accion
      if (!mongoose.Types.ObjectId.isValid(idUser)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      try{

        await mongoDB();

    // Obtén solo las tareas
    const user = await listadoUsuarios.findById(idUser).select('carrito'); 
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ carrito: user.carrito });

      }catch(error){
        return res.status(500).json({error:"Error del sisitema!!"})
      }
}

