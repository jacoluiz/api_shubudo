import express from "express";
import DefesaPessoalExtraBannerController from "../controllers/defesaExtraBannerController.js";

const router = express.Router();

// Rotas para Defesa Pessoal Extra Banner
router.post("/defesasPessoaisExtraBanner", DefesaPessoalExtraBannerController.criar);
router.get("/defesasPessoaisExtraBanner", DefesaPessoalExtraBannerController.listar);
router.get("/defesasPessoaisExtraBanner/:id", DefesaPessoalExtraBannerController.buscarPorId);
router.put("/defesasPessoaisExtraBanner/:id", DefesaPessoalExtraBannerController.atualizar);
router.delete("/defesasPessoaisExtraBanner/:id", DefesaPessoalExtraBannerController.excluir);

export default router;