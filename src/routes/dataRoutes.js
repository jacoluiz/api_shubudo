import express from "express";
import dateController from "../controllers/dataController.js";

const dateRoutes = express.Router();

dateRoutes.get("/datas", dateController.listarDatas);
dateRoutes.post("/datas", dateController.criarData);

export default dateRoutes;
