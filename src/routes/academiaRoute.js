import express from "express";
import AcademiaController from "../controllers/academiaController.js";

const academiaRoutes = express.Router();

academiaRoutes.get("/academias", AcademiaController.listarAcademias);
academiaRoutes.post("/academias", AcademiaController.criarAcademia);
academiaRoutes.put("/academias/:id", AcademiaController.atualizarAcademia);
academiaRoutes.delete("/academias/:id", AcademiaController.deletarAcademia);

export default academiaRoutes;
