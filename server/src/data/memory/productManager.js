class ProductManager {
  #products;

  constructor() {
    this.#products = [];
  }

  create(data) {
    const newProduct = {
      id: this.#generateId(),
      title: data.title,
      photo: data.photo,
      price: data.price,
      stock: data.stock,
    };

    this.#products.push(newProduct);
  }

  read() {
    return this.#products;
  }

  readOne(id) {
    return this.#products.find((product) => product.id === id);
  }

  #generateId() {
    // Método privado para generar un ID único y auto-incrementable
    return this.#products.length + 1;
  }
}

// Ejemplo de uso
const productManager = new ProductManager();

// Agregar productos
productManager.create({
  title: "cafe americano",
  photo: "ruta/imagen1.jpg",
  price: 29.99,
  stock: 50,
});

productManager.create({
  title: "cafe negro",
  photo: "ruta/imagen2.jpg",
  price: 39.99,
  stock: 30,
});

// Obtener todos los productos
const allProducts = productManager.read();
console.log("Todos los productos:", allProducts);

// Obtener un producto por ID
const productIdToFind = 1;
const foundProduct = productManager.readOne(productIdToFind);
console.log(`Producto con ID ${productIdToFind}:`, foundProduct);
