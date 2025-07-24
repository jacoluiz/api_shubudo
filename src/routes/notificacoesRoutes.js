import express from "express";
import notificacoesController from "../controllers/notificacaoController.js";

const router = express.Router();

router.put('/notificacoes', notificacoesController.enviarNotificacao);

export default router;
