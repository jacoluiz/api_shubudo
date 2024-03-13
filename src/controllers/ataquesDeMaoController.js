import { ataqueMao } from "../models/movimentoPadraoModel.js";

class ataqueDeMaoController {
    static async listarAtaquesMao(req, res) {
        try {
            const listaAtaquesDeMao = await ataqueMao.find({});
            res.status(200).json(listaAtaquesDeMao);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar`
            })
        }
    };

    static async listarAtaquesDeMaoPorCor(req, res) {
        const faixa = req.query.faixaCorespondente;
        try {
            const AtaquesDeMaoDaFaixa = await ataqueMao.find({ faixaCorespondente: faixa });
            res.status(200).json(AtaquesDeMaoDaFaixa);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    };

    static async atualizarAtaquesDeMao(req, res) {
        try {
            await ataqueMao.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: "Atualizado com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async excluirAtaquesDemao(req, res) {
        try {
            await ataqueMao.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async cadastrarAtaquesDemao(req, res) {
        try {
            const novoAtaqueDeMao = await ataqueMao.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Chute: novoAtaqueDeMao
            });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }
}

export default ataqueDeMaoController