import { defesa } from "../models/movimentoPadraoModel.js";

class defesaController {
    static async listarDefesas(req, res) {
        try {
            const listaDefesas = await defesa.find({});
            res.status(200).json(listaDefesas);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar`
            });
        }
    };

    static async listarDefesasPorCor(req, res) {
        const faixa = req.query.faixa;
        try {
            const defesasDaFaixa = await defesa.find({ faixa: faixa });
            res.status(200).json(defesasDaFaixa);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    // Atualizar múltiplas defesas via body (utilizando _id e video)
    static async atualizarDefesa(req, res) {
        try {
            // O body deve ser um array de objetos, onde cada objeto contém _id e video
            const updates = req.body;

            if (!Array.isArray(updates)) {
                return res.status(400).json({ message: 'O body deve ser um array de defesas para atualizar.' });
            }

            const results = await Promise.all(
                updates.map(async (updateObj) => {
                    const { _id, video } = updateObj;
                    if (!_id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "_id".');
                    }
                    return await defesa.findByIdAndUpdate(_id, { video }, { new: true });
                })
            );

            res.status(200).json({ message: "Defesas atualizadas com sucesso", data: results });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    static async excluirDefesa(req, res) {
        try {
            await defesa.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    static async cadastrarDefesa(req, res) {
        try {
            const novaDefesa = await defesa.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Defesa: novaDefesa
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }
}

export default defesaController;
