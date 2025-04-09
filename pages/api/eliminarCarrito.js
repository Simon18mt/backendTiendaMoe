import mongoDB from "../../lib/mongodb";
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "http://localhost:4200",
  })
);

export default async function handler(req, res) {
  await cors(req, res);

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await mongoDB(); // Asegúrate de que mongoDB() conecta correctamente
    const db = mongoose.connection;
    const collection = db.collection("listadousuarios");

    const { idUser, idCarrito } = req.body;

    if (!idUser || !idCarrito) {
      return res.status(400).json({ error: "ID de usuario o carrito no encontrado" });
    }

    // Validar formato de ObjectId
    if (!ObjectId.isValid(idUser) || !ObjectId.isValid(idCarrito)) {
      return res.status(400).json({ error: "ID de usuario o carrito no válido" });
    }

    // Convertir a ObjectId
    const idUserObjectId = new ObjectId(idUser);
    const idCarritoObjectId = new ObjectId(idCarrito);

  // 🔍 Busca si el carrito con ese producto existe dentro del usuario
  const buscarCarrito = await collection.findOne({
    _id: idUserObjectId,                     // Buscar por el ID del usuario
    "carrito._id": idCarritoObjectId        // Y que dentro del carrito haya un producto con ese ID
  });

    if (!buscarCarrito) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

  // 🧹 Elimina el producto del arreglo 'carrito' del usuario
  const result = await collection.updateOne(
    { _id: idUserObjectId }, // Buscar al usuario
    { $pull: { carrito: { _id: idCarritoObjectId } } } // Eliminar el producto del carrito
  );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "No se pudo eliminar el producto del carrito" });
    }

    res.status(200).json({ message: "Producto eliminado con éxito" });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
}
