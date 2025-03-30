import conectarBD from "../../lib/mongodb";
//"connect" es el nombre de la API route (esta puede variar)
//http://localhost:3000/api/connect
export default async function handler(req, res) {
  try {
    // Conecta a la base de datos
    await conectarBD();
    res.status(200).json({
      message: " ********* Conexión exitosa a MongoDB y NextJS ********* ",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error de conexión a MongoDB", error: error.message });
  }
}
//npm run dev
// http://localhost:3000/api/connect
