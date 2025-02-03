import express from "express";
import AvisoController from "../controllers/avisosController.js";

const routes = express.Router();

// Listar todos os avisos
routes.get("/aviso", AvisoController.listarAvisos);

// Buscar um aviso por ID
routes.get("/aviso/:id", AvisoController.buscarAvisoPorId);

// Cadastrar um novo aviso
routes.post("/aviso", AvisoController.cadastrarAviso);

// Atualizar um aviso existente
routes.put("/aviso/:id", AvisoController.atualizarAviso);

// Excluir um aviso
routes.delete("/aviso/:id", AvisoController.excluirAviso);

export default routes;
