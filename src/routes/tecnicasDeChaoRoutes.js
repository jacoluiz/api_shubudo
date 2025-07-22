import express from "express";
import TecnicaChaoController from "../controllers/tecnicasDeChaoController.js";

const router = express.Router();

// Rota para cadastrar uma nova técnica de chão
router.post("/tecnicasChao", TecnicaChaoController.cadastrarTecnica);

// Rota para listar técnicas de chão
// Se for enviado o parâmetro de query "faixa", lista filtrada por faixa
router.get("/tecnicasChao", (req, res) => {
    if (req.query.faixa) {
        TecnicaChaoController.listarTecnicasPorFaixa(req, res);
    } else {
        TecnicaChaoController.listarTecnicas(req, res);
    }
});

// Rota para atualizar técnicas de chão (em lote)
router.put("/tecnicasChao", TecnicaChaoController.atualizarTecnica);

// Rota para excluir uma técnica de chão por ID
router.delete("/tecnicasChao/:id", TecnicaChaoController.excluirTecnica);

export default router;
