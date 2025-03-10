import express from "express";
import defesaControler from "../controllers/defesaController.js";

const routes = express.Router();

routes.get("/defesa", defesaControler.listarDefesas);
routes.get("/defesa/busca", defesaControler.listarDefesasPorCor);

routes.post("/defesa", defesaControler.cadastrarDefesa);

routes.put("/defesa", defesaControler.atualizarDefesa);

routes.delete("/defesa/:id", defesaControler.excluirDefesa);

export default routes;