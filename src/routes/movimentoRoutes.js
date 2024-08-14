import express from "express";
import movimentosController from "../controllers/movimentosController.js";

const router = express.Router();

router.put('/movimentos', movimentosController.atualizarMovimentos);

export default router;
