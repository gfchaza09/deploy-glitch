import knex from "knex";

class ContenedorSQL {
  constructor(config, tabla) {
    this.knex = knex(config);
    this.tabla = tabla;
  }

  async listar(id) {
    const database = this.knex;
    try {
      const elem = await database.from(this.table).where("id", id);
      return elem;
    } catch (err) {
      console.log(err);
    }
  }

  async listarAll() {
    const database = this.knex;
    try {
      const rows = await database.from(this.tabla).select("*");
      return rows;
    } catch (err) {
      console.log(err);
    }
  }

  async guardar(elem) {
    const database = this.knex;
    try {
      await database(this.tabla).insert(elem);
      console.log("datos guardados");
    } catch (err) {
      console.log(err);
    }
  }

  async actualizar(elem, id) {
    const database = this.knex;
    try {
      await database.from(this.table).where("id", id).update(elem);
    } catch (err) {
      console.log(err);
    }
  }

  async borrar(id) {
    const database = this.knex;
    try {
      await database.from(this.tabla).where("id", "=", id).del();
      console.log(`elemento de id ${id} eliminado`);
    } catch (err) {
      console.log(err);
    }
  }

  async borrarAll() {
    const database = this.knex;
    try {
      await database.from(this.tabla).del();
      console.log("tabla vaciada");
    } catch (err) {
      console.log(err);
    }
  }

  async desconectar() {}
}

export default ContenedorSQL;
