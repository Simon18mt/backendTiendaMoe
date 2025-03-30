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

    // Verificar si el carrito existe
    const buscarCarrito = await collection.findOne({
      _id: idUserObjectId,
      "carrito._id": idCarritoObjectId,
    });

    if (!buscarCarrito) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    // Eliminar el producto del carrito
    const result = await collection.updateOne(
      { _id: idUserObjectId },
      { $pull: { carrito: { _id: idCarritoObjectId } } }
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
