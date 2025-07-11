import express from "express";
import dateController from "../controllers/dateController.js";

const dateRoutes = express.Router();

dateRoutes.get("/datas", dateController.listarDatas);
dateRoutes.post("/datas", dateController.criarData);

export default dateRoutes;
