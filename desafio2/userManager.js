const fs = require('fs').promises;

class UserManager {
  #usersFilePath;
  #users;

  constructor(usersFilePath) {
    this.#usersFilePath = usersFilePath;
    this.#users = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.#usersFilePath, 'utf-8');
      this.#users = JSON.parse(data);
    } catch (error) {
      this.#users = [];
    }
  }

  async saveToFile() {
    try {
      const dataToWrite = JSON.stringify(this.#users, null, 2);
      await fs.writeFile(this.#usersFilePath, dataToWrite, 'utf-8');
    } catch (error) {
      console.error('Error al guardar en el archivo:', error.message);
    }
  }

  async create(data) {
    try {
      const newUser = {
        id: await this.#generateIdAsync(),
        name: data.name,
        photo: data.photo,
        email: data.email,
      };

      this.#users.push(newUser);
      await this.saveToFile();
    } catch (error) {
      console.error('Error al crear usuario:', error.message);
    }
  }

  read() {
    return this.#users;
  }

  readOne(id) {
    return this.#users.find((user) => user.id === id);
  }

  async #generateIdAsync() {
    try {
      return this.#users.length + 1;
    } catch (error) {
      console.error('Error al generar ID:', error.message);
    }
  }
}


const usersFilePath = 'users.json'; 
const userManager = new UserManager(usersFilePath);

async function addUser() {
  await userManager.init();

  await userManager.create({
    name: 'jesus',
    photo: 'ruta/imagen1.jpg',
    email: 'usuario1@example.com',
  });

  await userManager.create({
    name: 'maria',
    photo: 'ruta/imagen2.jpg',
    email: 'usuario2@example.com',
  });

  const allUsers = userManager.read();
  console.log('Todos los usuarios:', allUsers);

  const userIdToFind = 1;
  const foundUser = userManager.readOne(userIdToFind);
  console.log(`Usuario con ID ${userIdToFind}:`, foundUser);
}

addUser();
