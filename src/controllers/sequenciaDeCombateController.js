import { sequenciaDeCombate } from "../models/defesaPessoalESequenciaModel.js";

class SequenciaDeCombateController {
    static async listarSequenciaDeCombate(req, res) {
        try {
            const listaSequencias = await sequenciaDeCombate.find({});
            res.status(200).json(listaSequencias);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar`
            })
        }
    };

    static async listarSequenciaDeCombatePorCor(req, res) {
        const faixa = req.query.faixaCorespondente;
        try {
            const defesasDaFaixa = await sequenciaDeCombate.find({ faixa: faixa });
            res.status(200).json(defesasDaFaixa);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    };

    static async atualizarSequencia(req, res) {
        try {
            await sequenciaDeCombate.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: "Atualizado com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async excluirSequencia(req, res) {
        try {
            await sequenciaDeCombate.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async cadastrarSequencia(req, res) {
        try {
            const novaDefesa = await sequenciaDeCombate.create(req.body);
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

export default SequenciaDeCombateController