import datosProductos from "../../models/datosProductos"
import mongoDB from "../../lib/mongodb" 
import initMiddleware from "../../lib/init-middleware" 
import Cors from "cors"

const cors = initMiddleware (
    Cors ({
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        origin: "http://localhost:4200", // Permitir solicitudes solo desde localhost:4200
    })
);

export default async function handler (req, res){
    await cors (req,res);

    if (req.method !== "POST"){
        return res.status(404).json({message: "METODO INCORRECTO"})
    }


    const errores = datosProductos.validate(req.body)
    if(errores.length > 0){
        return res.status(400).json({error:"error en el DTO",errores});
    }

    try{

        await mongoDB ();

        const nuevoProducto = new datosProductos ({
            username:req.body.username,
            precio:req.body.precio,
            cantidad:req.body.cantidad
        });

        if(!nuevoProducto){
            return res.status(400).json({error:"error en el nuevoProducto"});
        }

        const datoGuardado = await nuevoProducto.save();
        console.log(datoGuardado);

        return res.status(201).json(datoGuardado)
        


    } catch (errro){
        return res.status(500).json({error: "error general del sistema"})
    }
}