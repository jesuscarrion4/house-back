import express from "express";
import productManager from "./data/files/productManager.js";
const server = express();
const port = 8080;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const ready = () => `Server ready on port ${port}`;
server.listen(port, ready);

const dataFilePath = "./data/files/products.json";

// Middleware para manejo de errores global
server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    statuscode: 500,
    message: "Internal Server Error",
  });
});

// Ruta para obtener todos los productos
server.get("/api/products", async (req, res, next) => {
  try {
    const all = await readDataFromFile();
    if (all.length === 0) {
      return res.status(404).json({
        statuscode: 404,
        message: "Products not found",
      });
    }
    return res.status(200).json({
      statuscode: 200,
      response: all,
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para obtener un producto por ID
server.get("/api/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const one = await readOneFromDataFile(pid);
    if (!one) {
      return res.status(404).json({
        statuscode: 404,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      statuscode: 200,
      response: one,
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para crear un nuevo producto
server.post("/api/products", async (req, res, next) => {
  try {
    const { data } = req.body;
    await createDataInFile(data);
    return res.status(201).json({
      statuscode: 201,
      message: "Product created successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar un producto por ID
server.put("/api/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    const { data } = req.body;
    await updateDataInFile(pid, data);
    return res.status(200).json({
      statuscode: 200,
      message: "Product updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para eliminar un producto por ID
server.delete("/api/products/:pid", async (req, res, next) => {
  try {
    const { pid } = req.params;
    await destroyDataInFile(pid);
    return res.status(200).json({
      statuscode: 200,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

async function readDataFromFile() {
  const rawData = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(rawData);
}

async function readOneFromDataFile(id) {
  const allData = await readDataFromFile();
  return allData.find((item) => item.id === id);
}

async function createDataInFile(data) {
  const allData = await readDataFromFile();
  allData.push({ id: Date.now().toString(), ...data });
  await fs.writeFile(dataFilePath, JSON.stringify(allData, null, 2));
}

async function updateDataInFile(id, data) {
  const allData = await readDataFromFile();
  const index = allData.findIndex((item) => item.id === id);
  if (index !== -1) {
    allData[index] = { id, ...data };
    await fs.writeFile(dataFilePath, JSON.stringify(allData, null, 2));
  }
}

async function destroyDataInFile(id) {
  const allData = await readDataFromFile();
  const updatedData = allData.filter((item) => item.id !== id);
  await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2));
}