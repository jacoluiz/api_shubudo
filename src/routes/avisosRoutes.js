import express from "express";
import AvisoController from "../controllers/avisosController.js";

const routes = express.Router();

// Listar todos os avisos
routes.get("/aviso", AvisoController.listarAvisos);

// Buscar um aviso por ID
routes.get("/aviso/:id", AvisoController.buscarAvisoPorId);

// Cadastrar um novo aviso
routes.post("/aviso", AvisoController.cadastrarAviso);

// Atualizar um aviso específico por ID
routes.put("/aviso/:id", AvisoController.atualizarAviso);

// Atualizar vários avisos em lote
routes.put("/aviso", AvisoController.atualizarAvisosEmLote);

// Excluir um aviso por ID
routes.delete("/aviso/:id", AvisoController.excluirAviso);

export default routes;
