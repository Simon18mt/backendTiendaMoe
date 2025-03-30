import mongoDB from "../../lib/mongodb";
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import { ObjectId } from "mongodb";
import CarritoDTO from '../../models/DTOs/carritoDTO';
import listadoUsuarios from "../../models/datosUsuarios";

const cors = initMiddleware(
    Cors({
        methods: ["GET", "POST", "PUT", "DELETE"],
        origin: "http://localhost:4200", 
    })
);

export default async function handler(req, res) {
    await cors(req, res);

    if (req.method !== "PUT") {
        return res.status(404).json({ message: "MÉTODO INCORRECTO" });
    }

    const { idUser, productoData } = req.body;

    if (!productoData || !productoData._id) {
        return res.status(400).json({ error: 'El producto y su ID son requeridos' });
    }

    if (!idUser) {
        return res.status(400).json({ error: 'ID del usuario es requerido' });
    }

    if (!ObjectId.isValid(idUser) || !ObjectId.isValid(productoData._id)) {
        return res.status(400).json({ message: "ID inválido" });
    }

    try {
        await mongoDB();
        const usuarioExiste = await listadoUsuarios.findById(idUser).exec();

        if (!usuarioExiste) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (!Array.isArray(usuarioExiste.carrito)) {
            usuarioExiste.carrito = [];
        }

        const productoId = new ObjectId(productoData._id);

        // 🔹 Buscar si el producto ya está en el carrito
        const productoIndex = usuarioExiste.carrito.findIndex(p => new ObjectId(p._id).equals(productoId));

        if (productoIndex !== -1) {
            // 🔹 Si el producto ya existe, aumentar la cantidad
            usuarioExiste.carrito[productoIndex].cantidad += 1;
        } else {
            // 🔹 Si no existe, agregarlo con cantidad 1
            const nuevoProducto = new CarritoDTO(productoData.username, productoData.precio, 1);
            nuevoProducto._id = productoId; // Asegurar que el _id se conserve
            usuarioExiste.carrito.push(nuevoProducto);
        }

        await usuarioExiste.save();

        res.status(200).json({ message: 'Producto actualizado/agregado con éxito', usuario: usuarioExiste });

    } catch (error) {
        console.error("Error en la API:", error);
        return res.status(500).json({ error: "Error del sistema!!" });
    }
}
