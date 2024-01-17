import { promises as fs } from 'fs';

class OrdenManager {
  constructor(filename) {
    this.filename = filename;
    this.ordenes = [];
    this.loadOrders(); // Cargar órdenes existentes desde el archivo al inicializar la instancia
  }

  async loadOrders() {
    try {
      const data = await fs.readFile(this.filename, 'utf-8');
      this.ordenes = JSON.parse(data);
    } catch (error) {
      // Si hay un error al cargar el archivo (puede ser normal si es la primera ejecución),
      // simplemente inicializa el array de órdenes como vacío.
      this.ordenes = [];
    }
  }

  async saveOrders() {
    try {
      const data = JSON.stringify(this.ordenes, null, 2);
      await fs.writeFile(this.filename, data, 'utf-8');
    } catch (error) {
      throw new Error('Error al guardar las órdenes en el archivo');
    }
  }

  create(data) {
    try {
      const id = crypto.getRandomValues(new Uint32Array(1))[0];
      const nuevaOrden = {
        id,
        pid: data.pid,
        uid: data.uid,
        quantity: data.quantity,
        state: data.state
      };
      this.ordenes.push(nuevaOrden);
      this.saveOrders(); // Guarda las órdenes actualizadas en el archivo
      return nuevaOrden;
    } catch (error) {
      throw new Error('Error al crear la orden');
    }
  }

  read() {
    return [...this.ordenes]; // Devuelve una copia del array para evitar modificaciones no deseadas
  }

  readOne(id) {
    return this.ordenes.find(orden => orden.id === id) || null; // Devuelve null si no se encuentra la orden
  }

  destroy(id) {
    this.ordenes = this.ordenes.filter(orden => orden.id !== id);
    this.saveOrders(); // Guarda las órdenes actualizadas en el archivo
  }

  async update(id, data) {
    try {
      const orden = this.ordenes.find(orden => orden.id === id);
      if (orden) {
        Object.assign(orden, data); // Actualiza las propiedades de la orden
        await this.saveOrders(); // Guarda las órdenes actualizadas en el archivo
        return orden;
      } else {
        throw new Error('Orden no encontrada');
      }
    } catch (error) {
      throw new Error('Error al actualizar la orden');
    }
  }
}

// Ejemplo de uso
async function ejemploUso() {
  const filename = './src/data/fs/files/ordenes.json'; // Nombre del archivo donde se guardarán las órdenes
  const ordenManager = new OrdenManager(filename);

  try {
    const nuevaOrden = ordenManager.create({
      pid: 'producto123',
      uid: 'usuario456',
      quantity: 2,
      state: 'pendiente'
    });

    console.log(ordenManager.read()); // Mostrar todas las órdenes
    console.log(ordenManager.readOne(nuevaOrden.id)); // Mostrar una orden específica

    await ordenManager.update(nuevaOrden.id, { quantity: 3, state: 'completada' });
    console.log(ordenManager.read()); // Mostrar todas las órdenes actualizadas

    ordenManager.destroy(nuevaOrden.id);
    console.log(ordenManager.read()); // Mostrar todas las órdenes después de eliminar una
  } catch (error) {
    console.error('Error:', error.message);
  }
}

ejemploUso();
export default ordenManager;