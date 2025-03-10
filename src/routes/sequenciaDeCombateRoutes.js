import express from "express";
import sequenciaDeCombateController from "../controllers/sequenciaDeCombateController.js";

const routes = express.Router();

routes.get("/sequenciaDeCombate", sequenciaDeCombateController.listarSequenciaDeCombate);
routes.get("/sequenciaDeCombate/busca", sequenciaDeCombateController.listarSequenciaDeCombatePorCor);

routes.post("/sequenciaDeCombate", sequenciaDeCombateController.cadastrarSequencia);

routes.put("/sequenciaDeCombate", sequenciaDeCombateController.atualizarSequencia);

routes.delete("/sequenciaDeCombate/:id", sequenciaDeCombateController.excluirSequencia);

export default routes;