import express from "express";
import movimento from "./movimentoRoutes.js"
import faixa from "./faixaRoutes.js"
import chute from "./chuteRoutes.js"
import ataqueDeMao from "./ataqueMaoRoutes.js"
import defesa from "./defesaRoutes.js"
import defesaPessoal from "./defesaPessoalRoutes.js"
import sequenciaDeCombate from "./sequenciaDeCombateRoutes.js"
import kata from "./kataRoutes.js"
import usuario from "./usuarioRoutes.js"
import defesaPessoalExtraBanner from "./defesaExtraBannerRoutes.js";
import projecoes from "./projecoesRoutes.js";
import aviso from "./avisosRoutes.js";
import armamento from "./armamentoRoutes.js";
import defesasDeArma from "./defesasDeArmasRoutes.js"
import date from "./dataRoutes.js";
import tecnicasDeChao from "./tecnicasDeChaoRoutes.js";
import notificacoes from "./notificacoesRoutes.js";
import academia from "./academiaRoute.js";

const routes = (app) => {
    app.use(express.json(), movimento);
    app.use(express.json(), faixa);
    app.use(express.json(), chute);
    app.use(express.json(), ataqueDeMao);
    app.use(express.json(), defesa);
    app.use(express.json(), defesaPessoal);
    app.use(express.json(), sequenciaDeCombate);
    app.use(express.json(), kata);
    app.use(express.json(), usuario);
    app.use(express.json(), defesaPessoalExtraBanner);
    app.use(express.json(), projecoes);
    app.use(express.json(), aviso);
    app.use(express.json(), armamento)
    app.use(express.json(), defesasDeArma)
    app.use(express.json(), date)
    app.use(express.json(), tecnicasDeChao);
    app.use(express.json(), notificacoes);
    app.use(express.json(), academia);

};

export default routes;