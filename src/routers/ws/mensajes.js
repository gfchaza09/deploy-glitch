import mensajesApi from "../../api/mensajes.js";
import { normalizarMensajes } from "../../normalizacion/index.js";

export default async function configurarSocketMensajes(socket, io) {
  const chatList = async () => {
    let msgs = await mensajesApi.listarAll();

    let msgsN = await normalizarMensajes(msgs);

    io.sockets.emit("mensajes", msgsN);
  };

  socket.on("connection", async (data) => {
    await chatList();
  });

  socket.on("nuevoMensaje", async (data) => {
    await mensajesApi.guardar(data);
    await chatList();
  });
}
