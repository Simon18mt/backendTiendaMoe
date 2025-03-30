import mongoDB from "../../lib/mongodb" 
import initMiddleware from "../../lib/init-middleware" 
import RegistroDTO from "../../models/DTOs/registroDTO"
import Cors from "cors"
import listadoUsuarios from "../../models/datosUsuarios"
import bcrypt from "bcrypt"; // para encriptar la contraseña

const cors = initMiddleware(
    Cors({
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        origin: "http://localhost:4200", // Permitir solicitudes solo desde localhost:4200
    })
);


export default async function handler(req, res){
    await cors (req, res);

    //Para solo aceptar solicitudes de un tipo 
    if(req.method !== "POST" ){
        return res.status(404).json({message:"error en el metodo"})
    }

    //crear el DTO desde el cuerpo de la solicitud
    const registroDTO = RegistroDTO.fromRequestBody(req.body);

    //validar los datos del DTO
    const errores = RegistroDTO.validate(registroDTO);
    if ( errores.length > 0){
        return res.status(400).json({error:"error en el DTO",errores});
    }

    //LOGICA
try{

    //conexion a mongo
    await mongoDB();

    //Encriptar la contraseña

    // Definimos los "salt"
    const saltRounds = 10;
    // Creamos la nueva contraseña usando "bcrypt" y "hash"
    const hashedPassword = await bcrypt.hash(registroDTO.password, saltRounds);
    if(!hashedPassword){
        return res.status(400).json({error:"error en el hashedPassword"});
    }



        // Crear el nuevo usuario
        const nuevoUsuario = new listadoUsuarios({
            username: registroDTO.username,
            email: registroDTO.email,
            password: hashedPassword, /* hashedPassword */  
            userType: registroDTO.userType,
          });

          if(!nuevoUsuario){
            return res.status(400).json({error:"error en el nuevoUsuario"});
          }

          const usuarioGuardado = await nuevoUsuario.save()
          console.log(usuarioGuardado);
          
          return res.status(201).json(usuarioGuardado)

}catch(error){
    console.error("Error al crear el usuario:", error);
        return res.status(500).json({message:"erro generak del sistema",error})
}
}