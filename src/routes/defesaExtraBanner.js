import express from "express";
import DefesaPessoalExtraBannerController from "../controllers/defesaPessoalExtraBannerController.js";

const router = express.Router();

// Rotas para Defesa Pessoal Extra Banner
router.post("/defesas-pessoais-extra-banner", DefesaPessoalExtraBannerController.criar);
router.get("/defesas-pessoais-extra-banner", DefesaPessoalExtraBannerController.listar);
router.get("/defesas-pessoais-extra-banner/:id", DefesaPessoalExtraBannerController.buscarPorId);
router.put("/defesas-pessoais-extra-banner/:id", DefesaPessoalExtraBannerController.atualizar);
router.delete("/defesas-pessoais-extra-banner/:id", DefesaPessoalExtraBannerController.excluir);

export default router;