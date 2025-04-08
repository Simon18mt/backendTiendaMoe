import mongoDB from "../../lib/mongodb";
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import { ObjectId } from "mongodb";
import listadoUsuarios from "../../models/datosUsuarios";

const cors = initMiddleware(
  Cors({
    methods: ["PUT"], // Solo permitir el método PUT
    origin: "http://localhost:4200", // Permitir solicitudes solo desde el frontend
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { idUser, productoData } = req.body;

  if (!idUser || !productoData) {
    return res.status(400).json({ error: "ID de usuario y producto son requeridos" });
  }

  if (!ObjectId.isValid(idUser)) {
    return res.status(400).json({ message: "ID de usuario inválido" });
  }

  try {
    await mongoDB();
    // ".exec" Busca el usuario y espera el resultado de la base de datos antes de seguir.
    const usuario = await listadoUsuarios.findById(idUser).exec();
    // await y .exec()
    // El código se detenga hasta obtener la respuesta de la base de datos.

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario tiene carrito
    if (!usuario.carrito) {
      usuario.carrito = [];
    }

  
    // Buscar el producto en el carrito basado en el nombre y precio
    /* El método .find() recorre el array y devuelve 
    el primer elemento que cumpla con la condición especificada. */
    const productoExistente = usuario.carrito.find(
      // p representa cada producto en el carrito.
        (p) => p.username === productoData.username && p.precio === productoData.precio
    );

    if (productoExistente.cantidad >1) {
        // Si el producto ya existe, resta cantidad en 1
        productoExistente.cantidad --;
      } else {
        // Si no existe, agregarlo con cantidad 1
/*         usuario.carrito.push({
            username: productoData.username,
          precio: productoData.precio,
          cantidad: 1
        }); */
      }

    await usuario.save();

    return res.status(200).json({ message: "Carrito actualizado con éxito", usuario });
  } catch (error) {
    return res.status(500).json({ error: "Error del sistema" });
  }
}
