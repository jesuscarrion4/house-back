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
        console.log(`No se encontró ningún usuario con ID ${id}.`);
        return null;
      }

      console.log(`Usuario con ID ${id}:`, foundUser);
      return foundUser;
    } catch (error) {
      console.error('Error al buscar el usuario:', error.message);
      return null;
    }
  }

  async update(id, data) {
    try {
      const indexToUpdate = this.#users.findIndex((user) => user.id === id);

      if (indexToUpdate === -1) {
        throw new Error(`No se encontró ningún usuario con ID ${id}.`);
      }

      // Actualizar propiedades del usuario con los nuevos datos
      this.#users[indexToUpdate].name = data.name || this.#users[indexToUpdate].name;
      this.#users[indexToUpdate].photo = data.photo || this.#users[indexToUpdate].photo;
      this.#users[indexToUpdate].email = data.email || this.#users[indexToUpdate].email;

      console.log('Usuario actualizado con éxito:', this.#users[indexToUpdate]);

      await this.saveToFile();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error.message);
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

const usersFilePath = './src/data/fs/files/users.json';
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

  // Ejemplo de uso de la función update
  const userIdToUpdate = 1;
  await userManager.update(userIdToUpdate, {
    name: 'NuevoNombre',
    photo: 'nueva/ruta/imagen.jpg',
    email: 'nuevoemail@example.com',
  });

  const updatedUser = userManager.readOne(userIdToUpdate);
  console.log(`Usuario actualizado con ID ${userIdToUpdate}:`, updatedUser);

  const userIdToRemove = 1;
  await userManager.destroy(userIdToRemove);
}

addUser();
export default userManager;
