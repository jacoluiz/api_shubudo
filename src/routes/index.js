import express from "express";
import programacao from "./programacaoRoutes.js"
import faixa from "./faixaRoutes.js"
import chute from "./chuteRoutes.js"

const routes = (app) => {
    app.use(express.json(), programacao);
    app.use(express.json(), faixa);
    app.use(express.json(), chute);
};

export default routes;