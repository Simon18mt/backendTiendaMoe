import datosProductos from "../../models/datosProductos"
import mongoDB from "../../lib/mongodb" 
import initMiddleware from "../../lib/init-middleware" 
import Cors from "cors"
import mongoose from "mongoose";

const cors = initMiddleware(
    Cors ({
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        origin: "http://localhost:4200", // Permitir solicitudes solo desde localhost:4200
    })
)

export default async function handler(req,res){
    await cors (req,res);

    if (req.method !== "PUT"){
        return res.status(405).json({ message: "Método no permitido" });
    }

    try {

        await mongoDB();

        const { id, productoData } = req.body;  

        if(!id || !productoData){
            return res.status(404).json({error:"FALTAN DATOS"})
        }

        const resultadados = await datosProductos.updateOne(
      //Primer parámetro (filtro de búsqueda)
      //Buscamos un id que coincida con el id que recibimos del fron
      { _id: new mongoose.Types.ObjectId(id) },
      //Segundo parámetro (actualización) 
      { $set: { username: productoData.username, precio: productoData.precio, cantidad: productoData.cantidad }}
      //Utilizamos la operación de actualización $set de MongoDB

        )

        return res.status(200).json({message:"DATOS ACTALIZADOS!!!"})

    } catch(error){
        return res.status(500).json({ error: "Error del sistema", detalles: error.message });
    }
}