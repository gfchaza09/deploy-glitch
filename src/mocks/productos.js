import faker from "faker";
faker.locale = "es";

function createNFakeProducts(n) {
  const objs = [];

  for (let i = 0; i < n; i++) {
    objs.push(createFakeProduct());
  }

  return objs;
}

function createFakeProduct() {
  return {
    title: faker.commerce.product(),
    price: faker.commerce.price(),
    thumbnail: faker.image.imageUrl(),
  };
}

export { createFakeProduct, createNFakeProducts };
