import express from "express";
import defesapessoalControler from "../controllers/defesaPessoalController.js";

const routes = express.Router();

routes.get("/defesaPessoal", defesapessoalControler.listarDefesasPessoal);
routes.get("/defesaPessoal/busca", defesapessoalControler.listarDefesasPessoalPorCor);

routes.post("/defesaPessoal", defesapessoalControler.cadastrarDefesaPessoal);

routes.put("/defesaPessoal/:id", defesapessoalControler.atualizarDefesaPessoal);

routes.delete("/defesaPessoal/:id", defesapessoalControler.excluirDefesaPessoal);

export default routes;