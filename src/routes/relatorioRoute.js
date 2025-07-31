// routes/relatoriosRoutes.js
import express from "express";
import RelatorioController from "../controllers/relatorioController.js";

const router = express.Router();

router.get("/relatorios/organizacao", RelatorioController.gerarFilaEConeParaExame);

// Nova rota para gerar relatório de exame baseado no evento
router.get("/relatorios/exame/:eventoId", RelatorioController.gerarRelatorioExamePorEvento);

router.get("/relatorios/primeira-infancia/:eventoId", RelatorioController.gerarRelatorioPrimeiraInfanciaPorEvento);


export default router;
