import express from "express";
import ArmamentoController from "../controllers/armamentoController.js";

const router = express.Router();

// Rotas para Armamento
router.post("/armamentos", ArmamentoController.criar);
router.get("/armamentos", ArmamentoController.listar);
router.get("/armamentos/:id", ArmamentoController.buscarPorId);
router.put("/armamentos/:id", ArmamentoController.atualizar);
router.delete("/armamentos/:id", ArmamentoController.excluir);

export default router;
