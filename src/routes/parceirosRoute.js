import express from "express";
import parceiroController from "../controllers/parceirosController.js";

const parceiroRoutes = express.Router();

parceiroRoutes.get("/parceiros", parceiroController.listarParceiros);
parceiroRoutes.post("/parceiros", parceiroController.criarParceiro);
parceiroRoutes.put("/parceiros/:id", parceiroController.atualizarParceiro);
parceiroRoutes.delete("/parceiros/:id", parceiroController.deletarParceiro);

export default parceiroRoutes;
