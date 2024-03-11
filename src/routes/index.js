import express from "express";
import programacao from "./programacaoRoutes.js"
import faixa from "./faixaRoutes.js"

const routes = (app) => {
    app.use(express.json(), programacao);
    app.use(express.json(), faixa);
};

export default routes;