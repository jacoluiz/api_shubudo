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
};

export default routes;