import productosApi from "../../api/productos.js";

export default async function configurarSocketProductos(socket, io) {
  const prodList = async () => {
    let prod = await productosApi.listarAll();
    io.sockets.emit("productos", prod);
  };

  socket.on("connection", async (data) => {
    await prodList();
  });

  socket.on("update", async (data) => {
    await productosApi.guardar(data);
    await prodList();
  });
}
