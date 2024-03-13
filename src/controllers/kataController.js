import kata from "../models/kataModel.js";

class kataController {
    static async listarkatas(req, res) {
        try {
            const lista = await kata.find({});
            res.status(200).json(lista);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar katas`
            })
        }
    };

    static async listarKataPorCor(req, res) {
        const faixa = req.query.faixaCorespondente;
        try {
            const katasDaFaixa = await kata.find({ faixa: faixa });
            res.status(200).json(katasDaFaixa);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    };

    static async atualizarKata(req, res) {
        try {
            await kata.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: "Atualizado com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async excluirKata(req, res) {
        try {
            await kata.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async cadastrarKata(req, res) {
        try {
            const novo = await kata.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Kata: novo
            });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }
}

export default kataController