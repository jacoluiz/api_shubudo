import express from "express";
import ProjecaoController from "../controllers/ProjecaoController.js";

const routes = express.Router();

routes.get("/projecao", ProjecaoController.listar);
routes.get("/projecao/:id", ProjecaoController.buscarPorId);

routes.post("/projecao", ProjecaoController.criar);

// Alterado: agora PUT não recebe ":id" na URL
routes.put("/projecao", ProjecaoController.atualizar);

routes.delete("/projecao/:id", ProjecaoController.excluir);

export default routes;
