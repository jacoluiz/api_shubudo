import express from "express";
import chuteController from "../controllers/chutesController.js";

const routes = express.Router();

routes.get("/chute", chuteController.listarChutes);
routes.get("/chute/busca", chuteController.listarChutePorCor);

routes.post("/chute", chuteController.cadastrarChute);

routes.put("/chute/:id", chuteController.atualizarChute);

routes.delete("/chute/:id", chuteController.excluirChute);

export default routes;