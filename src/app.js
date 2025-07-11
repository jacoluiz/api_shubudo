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

// Inicializa app Express
const app = express();

// Habilita CORS para permitir requisições do frontend
app.use(cors());

// Permite parse de JSON no body das requisições
app.use(express.json());

// Serve arquivos estáticos (frontend) da pasta 'public'
app.use(express.static("public"));

// Monta rotas da API
routes(app);

// **Não chame mais `app.listen()` aqui**
// Apenas exporte o `app` para ser usado pelo `server.js`

export default app;
