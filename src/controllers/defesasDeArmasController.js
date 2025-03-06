import { defesaDeArmas } from "../models/armamentoModel.js";

class DefesaDeArmasController {
    // Listar todas as defesas
    static async listarDefesas(req, res) {
        try {
            const lista = await defesaDeArmas.find({});
            res.status(200).json(lista);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar defesas de armas`
            });
        }
    }

    // Listar defesas por faixa
    static async listarDefesaPorFaixa(req, res) {
        const faixa = req.query.faixa;
        try {
            const defesas = await defesaDeArmas.find({ faixa: faixa });
            res.status(200).json(defesas);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }

    // Atualizar defesas (espera um array de objetos com _id e campos a atualizar)
    static async atualizarDefesa(req, res) {
        try {
            const defesaUpdates = req.body;
            if (!Array.isArray(defesaUpdates)) {
                return res.status(400).json({ message: 'O body deve ser um array de defesas para atualizar.' });
            }
            const results = await Promise.all(
                defesaUpdates.map(async (updateObj) => {
                    const { _id, ...updateFields } = updateObj;
                    if (!_id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "_id".');
                    }
                    return await defesaDeArmas.findByIdAndUpdate(_id, updateFields, { new: true });
                })
            );
            res.status(200).json({ message: 'Defesas de armas atualizadas com sucesso', data: results });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message}` });
        }
    }

    // Excluir uma defesa
    static async excluirDefesa(req, res) {
        try {
            await defesaDeArmas.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }

    // Cadastrar uma nova defesa
    static async cadastrarDefesa(req, res) {
        try {
            const novo = await defesaDeArmas.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                defesa: novo
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }
}

export default DefesaDeArmasController;
