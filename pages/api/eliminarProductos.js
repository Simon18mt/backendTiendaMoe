import mongoDB from "../../lib/mongodb" 
 
import datosProductos from "../../models/datosProductos"
import initMiddleware from "../../lib/init-middleware" 
import Cors from "cors"
import mongoose from "mongoose"

const cors =  initMiddleware (
    Cors ({
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        origin: "http://localhost:4200", // Permitir solicitudes solo desde localhost:4200
    })
)

export default async function handler (req,res){
    await  cors(req,res);

    if(req.method !== "DELETE"){
        return res.status(404).json({message: "METODO INCORRECTO"})
    }

    try {

        await mongoDB();

        // ID del producto a eliminar
        const {idProducto} = req.body; 

        if(!idProducto){
            return res.status(404).json({error:"no se encuentra el ID"})
        }

        //Validar que el ID tenga el formato valido 
        if(!mongoose.Types.ObjectId.isValid(idProducto)){
            return res.status(404).json({error:"el ID no tiene el formato valido"})
        }

        // Convertir el id a un ObjectId válido
        const idProductoObjectId = new mongoose.Types.ObjectId(idProducto);

        //Eliminamos el priducto usando el ID
        const resultado = await datosProductos.deleteOne({ _id:idProductoObjectId})

        res.status(200).json({ message: "Producto eliminado exitosamente" });



    }catch (error){
        return res.status(500).json({error: "error en el sistema",error})
    }


}
