import express from "express";
import DefesaDeArmasController from "../controllers/defesaDeArmasController.js";

const router = express.Router();

// Rota para cadastrar uma nova defesa de armas
router.post("/defesasDeArmas", DefesaDeArmasController.cadastrarDefesa);

// Rota para listar defesas de armas
// Se for enviado o parâmetro de query "faixa", o método específico será utilizado.
router.get("/defesasDeArmas", (req, res) => {
    if (req.query.faixa) {
        DefesaDeArmasController.listarDefesaPorFaixa(req, res);
    } else {
        DefesaDeArmasController.listarDefesas(req, res);
    }
});

// Rota para atualizar defesas de armas (atualização em lote, espera body com array de objetos)
router.put("/defesasDeArmas", DefesaDeArmasController.atualizarDefesa);

// Rota para excluir uma defesa de armas por ID
router.delete("/defesasDeArmas/:id", DefesaDeArmasController.excluirDefesa);

export default router;
