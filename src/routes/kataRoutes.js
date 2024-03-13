import express from "express";
import kataController from "../controllers/kataController.js";

const routes = express.Router();

routes.get("/kata", kataController.listarkatas);
routes.get("/kata/busca", kataController.listarKataPorCor);

routes.post("/kata", kataController.cadastrarKata);

routes.put("/kata/:id", kataController.atualizarKata);

routes.delete("/kata/:id", kataController.excluirKata);

export default routes;