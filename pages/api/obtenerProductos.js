import datosProductos from "../../models/datosProductos"
import mongoDB from "../../lib/mongodb" 
import initMiddleware from "../../lib/init-middleware" 
import Cors from "cors"

const cors = initMiddleware (
    Cors ({
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        origin: "http://localhost:4200", // Permitir solicitudes solo desde localhost:4200
    })
) 

export default async function handler (req, res){
    await cors (req,res);

    if(req.method  !== "GET"){
        return res.status(404).json({message: "METODO INCORRECTO"})
    }

    try{

        await mongoDB();

        // Se usa await para esperar la consulta a la base de datos
        const productos = await datosProductos.find();

        return res.status(200).json({ productos }); 

    } catch (error){
        return res.status(500).json({error: "error general del sistema"})
    }


}