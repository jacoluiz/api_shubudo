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
            });
        }
    };

    static async listarSequenciaDeCombatePorCor(req, res) {
        const faixa = req.query.faixa;
        try {
            const defesasDaFaixa = await sequenciaDeCombate.find({ faixa: faixa });
            res.status(200).json(defesasDaFaixa);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    // Atualiza múltiplas sequências de combate via body
    // Cada objeto deve conter _id e os campos a atualizar (por exemplo, video)
    static async atualizarSequencia(req, res) {
        try {
            const updates = req.body;
            if (!Array.isArray(updates)) {
                return res.status(400).json({ message: "O body deve ser um array de sequências para atualizar." });
            }
            const results = await Promise.all(
                updates.map(async (updateObj) => {
                    const { _id, video } = updateObj;
                    if (!_id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "_id".');
                    }
                    return await sequenciaDeCombate.findByIdAndUpdate(_id, { video }, { new: true });
                })
            );
            res.status(200).json({ message: "Sequências atualizadas com sucesso", data: results });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    static async excluirSequencia(req, res) {
        try {
            await sequenciaDeCombate.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    static async cadastrarSequencia(req, res) {
        try {
            const novaDefesa = await sequenciaDeCombate.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Sequencia_de_combate: novaDefesa
            });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }
}

export default SequenciaDeCombateController;
