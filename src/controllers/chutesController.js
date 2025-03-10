import { chute } from "../models/movimentoPadraoModel.js";

class chuteController {
    static async listarChutes(req, res) {
        try {
            const listaChutes = await chute.find({});
            res.status(200).json(listaChutes);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar chutes`
            });
        }
    };

    static async listarChutePorCor(req, res) {
        const faixa = req.query.faixa;
        try {
            const chutesDaFaixa = await chute.find({ faixa: faixa });
            res.status(200).json(chutesDaFaixa);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    // Atualizar múltiplos chutes via body (espera array com _id e video)
    static async atualizarChute(req, res) {
        try {
            const updates = req.body;

            if (!Array.isArray(updates)) {
                return res.status(400).json({ message: "O body deve ser um array de chutes para atualizar." });
            }

            const results = await Promise.all(
                updates.map(async (updateObj) => {
                    const { _id, video } = updateObj;
                    if (!_id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "_id".');
                    }
                    return await chute.findByIdAndUpdate(_id, { video }, { new: true });
                })
            );

            res.status(200).json({ message: "Chutes atualizados com sucesso", data: results });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    static async excluirChute(req, res) {
        try {
            await chute.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    };

    static async cadastrarChute(req, res) {
        try {
            const novoChute = await chute.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Chute: novoChute
            });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }
}

export default chuteController;
