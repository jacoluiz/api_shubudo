import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectaNoBanco from "./config/dbConnect.js";
import routes from "./routes/index.js";

// Carrega variáveis de ambiente de .env
dotenv.config();

// Conecta no banco de dados
const conexao = await conectaNoBanco();
conexao.on("error", (erro) => {
  console.error("Erro na conexão com o MongoDB:", erro);
});
conexao.once("open", () => {
  console.log("Conectado no banco de dados");
});

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));
app.use(express.static("public"));
routes(app);

export default app;
