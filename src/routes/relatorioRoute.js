// routes/relatoriosRoutes.js
import express from "express";
import RelatorioController from "../controllers/relatorioController.js";

const router = express.Router();

router.get("/relatorios/organizacao", RelatorioController.gerarFilaEConeParaExame);

export default router;
