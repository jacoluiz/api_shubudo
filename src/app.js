import express from "express";
import conectaNoBanco from "./config/dbConnect.js";
import routes from "./routes/index.js";

const conexao = await conectaNoBanco();

conexao.on("error", (erro) => {
    console.error(erro);
});

conexao.once("open", () => {
    console.log("Conectado no banco de dados");
});

const app = express();
routes(app);

app.get("/programacao/:id", (req, res) => {
    const index = buscaFaixa(req.params.id);
    res.status(200).json(faixas[index]);
});

app.put("/programacao/:id", (req, res) => {
    const index = buscaFaixa(req.params.id);
    faixas[index].faixa = req.body.faixa;
    res.status(200).json(faixas);
});

app.delete("/programacao/:id", (req, res) => {
    const index = buscaFaixa(req.params.id);
    faixas.splice(index, 1)
    res.status(200).send("programacao apagada")
});

export default app;