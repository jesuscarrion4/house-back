import express from "express";
import ordenes from "./data/files/ordenManager.js";
const server = express();
const port = 8080;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const ready = () => `Server ready on port ${port}`;
server.listen(port, ready);


const filename = 'ordenes.json';
const ordenManager = new OrdenManager(filename);

server.use(express.json());

// Endpoint para crear una nueva orden
server.post('/api/orders', (req, res) => {
  try {
    const nuevaOrden = ordenManager.create(req.body);
    res.json(nuevaOrden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener una orden por UID
server.get('/api/orders/:uid', (req, res) => {
  const uid = req.params.uid;
  const orden = ordenManager.ordenes.filter((orden) => orden.uid === uid);
  res.json(orden);
});

// Endpoint para eliminar una orden por OID
server.delete('/api/orders/:oid', (req, res) => {
  const oid = req.params.oid;
  ordenManager.destroy(oid);
  res.json({ message: 'Orden eliminada correctamente' });
});

// Inicia el servidor
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});