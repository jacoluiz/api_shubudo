import express from "express";
import faixaController from "../controllers/faixaController.js";

const routes = express.Router();

routes.get("/faixa", faixaController.listarFaixas);
routes.get("/faixa/busca", faixaController.listarFaixaPorCor);

routes.post("/faixa", faixaController.cadastrarFaixa);

routes.put("/faixa/:id", faixaController.atualizarFaixa);

routes.delete("/faixa/:id", faixaController.excluirFaixa);

export default routes;