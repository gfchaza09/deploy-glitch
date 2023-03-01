import dotenv from "dotenv";
import yargs from "yargs/yargs";

dotenv.config();

const argv = yargs(process.argv.slice(2))
  .options({
    p: {
      alias: "port",
      type: "number",
      demandOption: true,
      describe: "Puerto del servidor",
    },
    m: {
      alias: "mode",
      type: "string",
      demandOption: true,
      describe: "Modo del servidor",
    },
  })
  .check((argv, options) => {
    if (isNaN(argv.p)) {
      throw "El puerto debe ser un número";
    }
    return true;
  })
  .default({
    p: 8080,
    m: "FORK",
  }).argv;

export default {
  PORT: argv.p,
  MODE: argv.m,
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: `./DB/ecommerce.sqlite`,
    },
    useNullAsDefault: true,
  },
  mariaDb: {
    client: "mysql",
    connection: {
      host: process.env.HOST,
      user: "root",
      password: "",
      database: "coderhouse",
    },
  },
  mongodb: {
    mongoUrl: process.env.MONGO_URL,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    },
  },
  fileSystem: {
    path: "./db",
  },
};
