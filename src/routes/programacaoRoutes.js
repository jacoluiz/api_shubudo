import express from "express";
import programacaoController from "../controllers/programacaoController.js";

const routes = express.Router();

routes.get("/programacao", programacaoController.listarProgramacao);

export default routes;