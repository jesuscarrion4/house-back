import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

class ProductManager {
  #products;
  #filePath;

  constructor(filePath) {
    this.#products = [];
    this.#filePath = filePath;
  }

  async initialize() {
    try {
      await fs.mkdir(path.dirname(this.#filePath), { recursive: true });
      const data = await fs.readFile(this.#filePath, 'utf-8');
      this.#products = JSON.parse(data);
    } catch (error) {
      console.error('Error al inicializar el gestor de productos:', error.message);
    }
  }

  async saveToFile() {
    try {
      await fs.writeFile(this.#filePath, JSON.stringify(this.#products, null, 2), 'utf-8');
      console.log('Datos guardados en el archivo:', this.#filePath);
    } catch (error) {
      console.error('Error al guardar datos en el archivo:', error.message);
    }
  }

  async create(data) {
    try {
      await this.#simulateAsyncOperation();

      if (!data.title || !data.price || !data.stock) {
        throw new Error('Los datos del producto son incompletos.');
      }

      const newProduct = {
        id: await this.#generateId(),
        title: data.title,
        photo: data.photo,
        price: data.price,
        stock: data.stock,
      };

      this.#products.push(newProduct);
      console.log('Producto creado exitosamente:', newProduct);

      await this.saveToFile();
    } catch (error) {
      console.error('Error al crear el producto:', error.message);
    }
  }

  async read() {
    return this.#products;
  }

  async readOne(id) {
    try {
      await this.#simulateAsyncOperation();

      const foundProduct = this.#products.find((product) => product.id === id);

      if (!foundProduct) {
        console.log(`No se encontró ningún producto con ID ${id}.`);
        return null;
      }

      console.log(`Producto con ID ${id}:`, foundProduct);
      return foundProduct;
    } catch (error) {
      console.error('Error al buscar el producto:', error.message);
      return null;
    }
  }

  async destroy(id) {
    try {
      await this.#simulateAsyncOperation();
      const indexToRemove = this.#products.findIndex((product) => product.id === id);
  
      if (indexToRemove === -1) {
        console.log(`No se encontró ningún producto con ID ${id}. No se eliminó nada.`);
        return;
      }
  
      const removedProduct = this.#products.splice(indexToRemove, 1)[0];
      console.log(`Producto eliminado con éxito:`, removedProduct);
  
      await this.saveToFile();
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
    }
  }

  async update(id, data) {
    try {
      await this.#simulateAsyncOperation();

      const productToUpdateIndex = this.#products.findIndex((product) => product.id === id);

      if (productToUpdateIndex === -1) {
        console.log(`No se encontró ningún producto con ID ${id}. No se realizó ninguna actualización.`);
        return;
      }

      const updatedProduct = {
        ...this.#products[productToUpdateIndex],
        ...data,
        id: this.#products[productToUpdateIndex].id, // Asegurar que el ID no cambie
      };

      this.#products[productToUpdateIndex] = updatedProduct;
      console.log('Producto actualizado con éxito:', updatedProduct);

      await this.saveToFile();
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
    }
  }

  async #generateId() {
    try {
      const hash = createHash('sha256');
      hash.update(Date.now().toString());
      return hash.digest('hex').slice(0, 8); // Utiliza los primeros 8 caracteres para el ID
    } catch (error) {
      console.error('Error al generar ID:', error.message);
    }
  }

  async #simulateAsyncOperation() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}

const filePath = './src/data/fs/files/prductos.json';
const productManager = new ProductManager(filePath);

(async () => {
  await productManager.initialize();

  // Agregar productos
  await productManager.create({
    title: 'cafe americano',
    photo: 'ruta/imagen1.jpg',
    price: 29.99,
    stock: 50,
  });

  await productManager.create({
    title: 'cafe negro',
    photo: 'ruta/imagen2.jpg',
    price: 39.99,
    stock: 30,
  });

  const allProducts = await productManager.read();
  console.log('Todos los productos:', allProducts);

  const productIdToFind = 1;
  await productManager.readOne(productIdToFind);

  // Actualizar un producto por ID
  const productIdToUpdate = 1;
  const updatedData = {
    title: 'cafe descafeinado',
    price: 49.99,
    stock: 20,
  };
  await productManager.update(productIdToUpdate, updatedData);

  // Mostrar todos los productos después de la actualización
  const updatedProducts = await productManager.read();
  console.log('Todos los productos después de la actualización:', updatedProducts);

  // Eliminar un producto por ID
  const productIdToDelete = 1;
  await productManager.destroy(productIdToDelete);
})();

export default productManager;
