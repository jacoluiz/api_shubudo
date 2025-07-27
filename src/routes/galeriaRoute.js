import express from "express";
import multer from "multer";
import GaleriaEventoController from "../controllers/galeriaEventoController.js";
import GaleriaFotoController from "../controllers/galeriaFotoController.js";

const galeriaRoutes = express.Router();
const upload = multer(); // Para tratar o upload de imagens em memória

//ROTAS DE EVENTOS (galeria)
galeriaRoutes.get("/galeria/eventos", GaleriaEventoController.listarEventos);
galeriaRoutes.post("/galeria/eventos", GaleriaEventoController.criarEvento);
galeriaRoutes.put("/galeria/eventos/:id", GaleriaEventoController.atualizarEvento);
galeriaRoutes.delete("/galeria/eventos/:id", GaleriaEventoController.deletarEvento);

//ROTAS DE FOTOS (dentro de um evento)
galeriaRoutes.get("/galeria/fotos/:eventoId", GaleriaFotoController.listarPorEvento);
galeriaRoutes.post(
  "/galeria/fotos/:eventoId",
  upload.array("foto"),
  GaleriaFotoController.enviarFoto
);
galeriaRoutes.delete("/galeria/fotos", GaleriaFotoController.deletarFotos);

export default galeriaRoutes;
