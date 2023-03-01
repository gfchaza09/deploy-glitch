import knex from "knex";
import config from "../src/config.js";

//------------------------------------------
// productos en MariaDb

try {
  const mariaDbClient = knex(config.mariaDb);

  await mariaDbClient.schema.dropTableIfExists("productos");

  await mariaDbClient.schema.createTable("productos", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.integer("price").notNullable();
    table.string("thumbnail").notNullable();
  });
  console.log("tabla productos en mariaDb creada con éxito");
} catch (error) {
  console.log("error al crear tabla productos en mariaDb");
  console.log(error);
} finally {
  () => {
    mariaDbClient.destroy();
  };
}
