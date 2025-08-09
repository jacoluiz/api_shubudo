// routes/relatoriosRoutes.js
import express from "express";
import RelatorioController from "../controllers/relatorioController.js";

const router = express.Router();

// Geração da organização por evento (com cones e filas dinâmicos)
router.get(
  "/relatorios/organizacao/:eventoId",
  RelatorioController.gerarFilaEConeParaExame
);

router.get(
  "/relatorios/exame/:eventoId",
  RelatorioController.gerarRelatorioExamePorEvento
);

router.get(
  "/relatorios/primeira-infancia/:eventoId",
  RelatorioController.gerarRelatorioPrimeiraInfanciaPorEvento
);

export default router;
