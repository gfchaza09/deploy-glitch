import express, { Router } from "express";
import { calcular } from "../../api/randoms.js";

const randomsApiRouter = new Router();

randomsApiRouter.get("/api/randoms", async (req, res) => {
  const cant = req.query.cant || 100000000;
  const result = await calcular(cant);
  res.json(result);
});

export default randomsApiRouter;
