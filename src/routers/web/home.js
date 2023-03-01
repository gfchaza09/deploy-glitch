import { cpus } from "os";

import express, { Router } from "express";
import { webAuth } from "../../auth/index.js";

import path from "path";

const app = express();

const homeWebRouter = new Router();

homeWebRouter.get("/home", webAuth, (req, res) => {
  res.render("home.ejs", { nombre: req.user.email });
});

homeWebRouter.get("/productos-vista-test", (req, res) => {
  res.sendFile(path.resolve(app.get("views") + "/productos-vista-test.html"));
});

homeWebRouter.get("/info", (req, res) => {
  res.json({
    argumentosEntrada: `Argumentos de entrada: ${process.argv
      .slice(2)
      .join(", ")}`,
    plataforma: `Nombre de la plataforma (sistema operativo): ${process.platform}`,
    version: `Versión de Node.js: ${process.version}`,
    memoriaTotalRes: `Memoria total reservada (MB): ${parseInt(
      process.memoryUsage().rss / 1024 / 1024
    )}`,
    pathEjecucion: `Path de ejecución: ${process.execPath}`,
    processId: `Process ID: ${process.pid}`,
    carpetaProyecto: `Carpeta del proyecto: ${process.cwd()}`,
    numeroProcesadores: `Número de procesadores: ${cpus().length}`,
  });
});

export default homeWebRouter;
