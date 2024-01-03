class UserManager {
  #users;

  constructor() {
    this.#users = [];
  }

  create(data) {
    const newUser = {
      id: this.#generateId(),
      name: data.name,
      photo: data.photo,
      email: data.email,
    };

    this.#users.push(newUser);
  }

  read() {
    return this.#users;
  }

  readOne(id) {
    return this.#users.find((user) => user.id === id);
  }

  #generateId() {
    // Método privado para generar un ID único y auto-incrementable
    return this.#users.length + 1;
  }
}

// Ejemplo de uso
const userManager = new UserManager();

// Agregar usuarios
userManager.create({
  name: "jesus",
  photo: "ruta/imagen1.jpg",
  email: "usuario1@example.com",
});

userManager.create({
  name: "maria",
  photo: "ruta/imagen2.jpg",
  email: "usuario2@example.com",
});

// Obtener todos los usuarios
const allUsers = userManager.read();
console.log("Todos los usuarios:", allUsers);

// Obtener un usuario por ID
const userIdToFind = 1;
const foundUser = userManager.readOne(userIdToFind);
console.log(`Usuario con ID ${userIdToFind}:`, foundUser);

