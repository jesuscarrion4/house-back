import { Router } from "express";
//import ordenesManager from "../../src/data/fs/ordenesManager.js";
import userManager from "../../src/data/fs/userManager.js";
const ordenesRouter = Router();



// Endpoint para crear una nueva orden
ordenesRouter.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = await userManager.create(orderData);
    res.json({ message: 'Orden creada con éxito', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la orden', message: error.message });
  }
});

// Endpoint para obtener una orden por ID
ordenesRouter.get('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await userManager.read(orderId);

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: `No se encontró ninguna orden con ID ${orderId}` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la orden', message: error.message });
  }
});

// Endpoint para eliminar una orden por ID
ordenesRouter.delete('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    await userManager.destroy(orderId);
    res.json({ message: `Orden con ID ${orderId} eliminada con éxito` });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la orden', message: error.message });
  }
});

export default ordenesRouter;