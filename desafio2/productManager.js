const fs = require('fs/promises');

class ProductManager {
  #path;
  #products; // Make products a private field

  constructor(path) {
    this.#path = path;
    this.#initializeFile();
  }

  async #initializeFile() {
    try {
      await fs.access(this.#path);
    } catch (err) {
      // If the file does not exist, create an empty file
      await fs.writeFile(this.#path, '[]', 'utf-8');
    }
  }

  async addProduct(productData) {
    await this.#readProducts(); // Ensure products are read before adding
    const newProduct = {
      id: this.#generateNextId(),
      ...productData,
    };
    this.#products.push(newProduct);
    await this.#writeProducts();
    return newProduct;
  }

  async getProducts() {
    await this.#readProducts();
    return this.#products;
  }

  async getProductById(id) {
    await this.#readProducts();
    return this.#products.find(product => product.id === id);
  }

  async updateProduct(id, updatedProduct) {
    await this.#readProducts();
    const productIndex = this.#products.findIndex(product => product.id === id);

    if (productIndex !== -1) {
      this.#products[productIndex] = {
        ...this.#products[productIndex],
        ...updatedProduct,
      };
      await this.#writeProducts();
      return this.#products[productIndex];
    } else {
      throw new Error('Product not found.');
    }
  }

  async deleteProduct(id) {
    await this.#readProducts();
    this.#products = this.#products.filter(product => product.id !== id);
    await this.#writeProducts();
    return true;
  }

  async #readProducts() {
    try {
      const data = await fs.readFile(this.#path, 'utf-8');
      this.#products = data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Error reading products:', err.message);
      this.#products = [];
    }
  }

  async #writeProducts() {
    try {
      const data = JSON.stringify(this.#products, null, 2);
      await fs.writeFile(this.#path, data, 'utf-8');
      console.log('Products saved successfully');
    } catch (err) {
      console.error('Error saving products:', err.message);
    }
  }

  #generateNextId() {
    const maxId = this.#products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }
}

// Example of usage
async function exampleAsync() {
  const manager = new ProductManager('./productos.json');

  // Add product
  const newProduct = await manager.addProduct({
    title: 'coffee',
    description: 'coffee description',
    price: 19.99,
    thumbnail: 'path/to/image.jpg',
    code: 'ABC123',
    stock: 50,
  });
  console.log('New product:', newProduct);

  // Get all products
  const allProducts = await manager.getProducts();
  console.log('All products:', allProducts);

  // Get product by ID
  const productIdToFind = 1;
  const foundProduct = await manager.getProductById(productIdToFind);
  console.log(`Product with ID ${productIdToFind}:`, foundProduct);

  // Update product
  const updatedProduct = await manager.updateProduct(newProduct.id, { price: 24.99 });
  console.log('Product updated:', updatedProduct);

  // Delete product
  //const deleteResult = await manager.deleteProduct(newProduct.id);
  //console.log('Product deleted:', deleteResult);

  // Get all products after deletion
  //const productsAfterDelete = await manager.getProducts();
  //console.log('Products after deletion:', productsAfterDelete);
}

exampleAsync();
