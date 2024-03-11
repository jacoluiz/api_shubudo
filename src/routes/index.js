import express from "express";
import programacao from "./programacaoRoutes.js"

const routes = (app) => {
    app.use(express.json(), programacao);
};

export default routes;