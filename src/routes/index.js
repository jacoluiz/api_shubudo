import express from "express";
import programacao from "./programacaoRoutes.js"

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).sand("index"));

    app.use(express.json(), programacao);
};

export default routes;