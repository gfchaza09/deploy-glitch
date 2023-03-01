import fs from "fs";

class ContenedorArchivo {
  constructor(ruta) {
    this.ruta = ruta;
  }

  async listar(id) {
    const products = await this.listarAll();
    try {
      const product = products.find((prod) => prod.id === id);
      return product ? product : null;
    } catch (error) {
      console.log(error);
    }
  }

  async listarAll() {
    try {
      const products = await fs.promises.readFile(this.ruta, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.log(error);
    }
  }

  async guardar(product) {
    const products = await this.listarAll();
    try {
      let id;
      products.length === 0
        ? (id = 1)
        : (id = products[products.length - 1].id + 1);
      const newProduct = { ...product, id };
      products.push(newProduct);
      await this.writeFile(products);
      return newProduct.id;
    } catch (error) {
      console.log(error);
    }
  }

  async actualizar(prod, id) {
    const products = await this.listarAll();
    try {
      const updatedProduct = products.find(
        (product) => product.id === parseInt(id)
      );
      if (updatedProduct) {
        const prods = products.filter((product) => product.id !== parseInt(id));
        prods.push({ ...prod, id: parseInt(id), timestamp: Date.now() });
        await this.writeFile(prods);
        return updatedProduct;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async borrar(id) {
    const products = await this.listarAll();
    try {
      const newProducts = products.filter((prod) => prod.id !== id);
      await this.writeFile(newProducts);
    } catch (error) {
      console.log(error);
    }
  }

  async borrarAll() {
    await this.writeFile([]);
  }

  async writeFile(data) {
    try {
      await fs.promises.writeFile(this.ruta, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(error);
    }
  }
}

export default ContenedorArchivo;
