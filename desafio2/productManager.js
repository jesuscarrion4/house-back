const fs = require('fs').promises;

class ProductManager {
  #products;
  #filePath;

  constructor(filePath) {
    this.#products = [];
    this.#filePath = filePath;
  }

  async initialize() {
    try {
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

  async #generateId() {
    await this.#simulateAsyncOperation();
    return this.#products.length + 1;
  }

  async #simulateAsyncOperation() {
    
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}


const filePath = 'productos.json';


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
})();
