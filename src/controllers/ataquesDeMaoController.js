import { ataqueMao } from "../models/movimentoPadraoModel.js";

class ataqueDeMaoController {
    static async listarAtaquesMao(req, res) {
        try {
            const listaAtaquesDeMao = await ataqueMao.find({});
            res.status(200).json(listaAtaquesDeMao);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar`
            });
        }
    };

    static async listarAtaquesDeMaoPorCor(req, res) {
        const faixa = req.query.faixa;
        try {
            const ataquesDeMaoDaFaixa = await ataqueMao.find({ faixa: faixa });
            res.status(200).json(ataquesDeMaoDaFaixa);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    // Atualiza múltiplos ataques de mão via body
    // O body deve ser um array de objetos contendo _id e, por exemplo, video
    static async atualizarAtaquesDeMao(req, res) {
        try {
            const updates = req.body;

            if (!Array.isArray(updates)) {
                return res.status(400).json({ message: "O body deve ser um array de ataques para atualizar." });
            }

            const results = await Promise.all(
                updates.map(async (updateObj) => {
                    const { _id, video } = updateObj;
                    if (!_id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "_id".');
                    }
                    return await ataqueMao.findByIdAndUpdate(_id, { video }, { new: true });
                })
            );

            res.status(200).json({ message: "Ataques de mão atualizados com sucesso", data: results });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    static async excluirAtaquesDemao(req, res) {
        try {
            await ataqueMao.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    static async cadastrarAtaquesDemao(req, res) {
        try {
            const novoAtaqueDeMao = await ataqueMao.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Ataque_de_mãos: novoAtaqueDeMao
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }
}

export default ataqueDeMaoController;
