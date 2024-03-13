import { defesa } from "../models/movimentoPadraoModel.js";

class defesaController {
    static async listarDefesas(req, res) {
        try {
            const listaDefesas = await defesa.find({});
            res.status(200).json(listaDefesas);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar`
            })
        }
    };

    static async listarDefesasPorCor(req, res) {
        const faixa = req.query.faixaCorespondente;
        try {
            const defesasDaFaixa = await defesa.find({ faixaCorespondente: faixa });
            res.status(200).json(defesasDaFaixa);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    };

    static async atualizarDefesa(req, res) {
        try {
            await defesa.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: "Atualizado com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async excluirDefesa(req, res) {
        try {
            await defesa.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async cadastrarDefesa(req, res) {
        try {
            const novaDefesa = await defesa.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Chute: novaDefesa
            });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }
}

export default defesaController