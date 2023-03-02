import { createServer } from "./server.js";
import config from "./config.js";

const PORT = process.env.PORT || 8080;

const app = createServer();
try {
  const connectedServer = await app.listen(PORT);
  console.log(
    `proceso #${process.pid} escuchando en el puerto ${
      connectedServer.address().port
    }`
  );
} catch (error) {
  console.log(`Error en servidor ${error}`);
}
