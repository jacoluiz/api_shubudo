import express from "express";
import programacao from "./programacaoRoutes.js"
import faixa from "./faixaRoutes.js"
import chute from "./chuteRoutes.js"
import ataqueDeMao from "./ataqueMaoRoutes.js"
import defesa from "./defesaRoutes.js"
import defesaPessoal from "./defesaPessoalRoutes.js"
import sequenciaDeCombate from "./sequenciaDeCombateRoutes.js"
import kata from "./kataRoutes.js"

const routes = (app) => {
    app.use(express.json(), programacao);
    app.use(express.json(), faixa);
    app.use(express.json(), chute);
    app.use(express.json(), ataqueDeMao);
    app.use(express.json(), defesa);
    app.use(express.json(), defesaPessoal);
    app.use(express.json(), sequenciaDeCombate);
    app.use(express.json(), kata);
};

export default routes;