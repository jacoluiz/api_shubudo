import express from "express";
import conectaNoBanco from "./config/dbConnect.js";
import programacao from "./models/programacaoModel.js";

const conexao = await conectaNoBanco();

conexao.on("error", (erro) => {
    console.error(erro);
});

conexao.once("open", () => {
    console.log("Conectado no banco de dados");
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Teste de ex");
});

app.get("/programacao", async (req, res) => {
    const listaProgramacao = await programacao.find({});
    res.status(200).json(listaProgramacao);
});

app.get("/programacao/:id", (req, res) => {
    const index = buscaFaixa(req.params.id);
    res.status(200).json(faixas[index]);
});

app.post("/programacao", (req, res) => {
    faixas.push(req.body);
    res.status(201).send("programacao adicionada");
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