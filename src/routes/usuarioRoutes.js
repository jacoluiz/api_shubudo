import express from "express";
import usuarioController from "../controllers/usuarioController.js";

const routes = express.Router();

// Lista todos os usuários
routes.get("/usuarios", usuarioController.listarUsuarios);

// Busca usuário por ID
routes.get("/usuarios/:id", usuarioController.buscarUsuarioPorId);

// Cadastra um novo usuário
routes.post("/usuarios", usuarioController.cadastrarUsuario);

// Atualiza os dados de um usuário
routes.put("/usuarios/:id", usuarioController.atualizarUsuario);

// Exclui um usuário
routes.delete("/usuarios/:id", usuarioController.excluirUsuario);

// Busca a faixa de um usuário (usando ID ou email)
routes.get("/usuarios/faixa", usuarioController.buscarFaixaDoUsuario);

routes.post("/usuarios/login", usuarioController.login);

export default routes;
