import mongoDB from "../../lib/mongodb"
import listadoUsuarios from "../../models/datosUsuarios"
import initMiddleware from "../../lib/init-middleware"
import Cors from "cors"
import LoginDTO from "../../models/DTOs/loginDTO"
import bcrypt from "bcrypt"; 
// Para el TOKEN jwt
import jwt from "jsonwebtoken";
 

const cors = initMiddleware(
    Cors({
        methods : ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        origin: "http://localhost:4200", // Permitir solicitudes solo desde localhost:4200
    }))

export default async function handler (req,res){
    await cors(req, res);

    if(req.method !== "POST"){
        return res.status(404).json({message:"error en el metodo"})
    }

    const loginDTO = LoginDTO.fromRequestBody(req.body)

    const error = LoginDTO.validate (loginDTO);
    if( error.length > 0 ){
        return res.status(400).json({error});
    }

    try{

        await mongoDB();

        const datosLogin = await listadoUsuarios.findOne({
            email: loginDTO.email,
        })

        if(!datosLogin){
            return res.status(401).json({error:"correo incorrecto"})
        }

        const contraseñaCorrecta = await bcrypt.compare(
            loginDTO.password,
            datosLogin.password
        )

        if(!contraseñaCorrecta){
            return res.status(401).json({error: "Contraseña incorrecta" })
        }

        return res.status(200).json({token: CreateToken(datosLogin) })
    
    }catch (error){
        console.error("Error al crear el usuario:", error);
        return res.status(500).json({message:"erro generak del sistema",error}) 
    }

    function CreateToken(datosLogin) {
        const playload = {
          user_id: datosLogin._id,
          username: datosLogin.username,
          email: datosLogin.email,
          userType: datosLogin.userType

        };
        // Definir el token con tiempo de expiración de 1 hora
        return jwt.sign(playload, "en un lugar de la mancha", { expiresIn: "1h" });
      }
    
}