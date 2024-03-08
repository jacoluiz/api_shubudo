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

export default app;