import { createServer } from "./server.js";
import config from "./config.js";

const app = createServer();
try {
  const connectedServer = await app.listen(config.PORT);
  console.log(
    `proceso #${process.pid} escuchando en el puerto ${
      connectedServer.address().port
    }`
  );
} catch (error) {
  console.log(`Error en servidor ${error}`);
}
