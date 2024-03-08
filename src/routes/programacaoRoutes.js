import express from "express";
import programacaoController from "../controllers/programacaoController.js";

const routes = express.Router();

routes.get("/programacao", programacaoController.listarProgramacao);
routes.get("/programacao/busca", programacaoController.listarProgramacaoPorFaixa);
routes.get("/programacao/:id", programacaoController.listarProgramacaoPorId);

routes.post("/programacao", programacaoController.cadastrarProgramacao);

routes.put("/programacao/:id", programacaoController.atualizarProgramacao);

routes.delete("/programacao/:id", programacaoController.excluirProgramacao);

export default routes;