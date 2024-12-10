import express from "express";
import ProjecaoController from "../controllers/projecaoController.js";

const router = express.Router();

// Rotas para Projeções
router.post("/projecoes", ProjecaoController.criar);
router.get("/projecoes", ProjecaoController.listar);
router.get("/projecoes/:id", ProjecaoController.buscarPorId);
router.put("/projecoes/:id", ProjecaoController.atualizar);
router.delete("/projecoes/:id", ProjecaoController.excluir);

export default router;
