import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

class UserManager {
  #usersFilePath;
  #users;

  constructor(usersFilePath) {
    this.#usersFilePath = path.resolve(usersFilePath);
    this.#users = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.#usersFilePath, 'utf-8');
      this.#users = JSON.parse(data);
    } catch (error) {
      console.error('Error al inicializar usuarios:', error.message);
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

  async read() {
    return this.#users;
  }

  async readOne(id) {
    try {

      const foundUser = this.#users.find((user) => user.id === id);

      if (!foundUser) {
        console.log(`No se encontró ningún user con ID ${id}.`);
        return null;
      }

      console.log(`user con ID ${id}:`, foundUser);
      return foundUser;
    } catch (error) {
      console.error('Error al buscar el user:', error.message);
      return null;
    }
  }

  async destroy(id) {
    try {
      const indexToRemove = this.#users.findIndex((user) => user.id === id);

      if (indexToRemove === -1) {
        throw new Error(`No se encontró ningún usuario con ID ${id}.`);
      }

      const removedUser = this.#users.splice(indexToRemove, 1)[0];
      console.log('Usuario eliminado con éxito:', removedUser);

      await this.saveToFile();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error.message);
    }
  }

  async #generateIdAsync() {
    try {
      const hash = createHash('sha256');
      hash.update(Date.now().toString());
      return hash.digest('hex').slice(0, 8); 
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

  const userIdToRemove = 1;
  await userManager.destroy(userIdToRemove);
}

addUser();

export default userManager;