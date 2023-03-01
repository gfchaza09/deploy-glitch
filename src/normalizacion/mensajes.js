import { normalize, schema } from "normalizr";

const schemaAuthor = new schema.Entity("author");

const schemaMessages = new schema.Entity("messages", {
  author: schemaAuthor,
});

const normalizarMensajes = async (mensajes) => {
  const normalizedData = normalize(mensajes, [schemaMessages]);
  return normalizedData;
};

export { normalizarMensajes };
