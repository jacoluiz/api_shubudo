import express from "express";
import ataqueDeMaoController from "../controllers/ataquesDeMaoController.js";

const routes = express.Router();

routes.get("/ataqueMao", ataqueDeMaoController.listarAtaquesMao);
routes.get("/ataqueMao/busca", ataqueDeMaoController.listarAtaquesDeMaoPorCor);

routes.post("/ataqueMao", ataqueDeMaoController.cadastrarAtaquesDemao);

routes.put("/ataqueMao", ataqueDeMaoController.atualizarAtaquesDeMao);

routes.delete("/ataqueMao/:id", ataqueDeMaoController.excluirAtaquesDemao);

export default routes;