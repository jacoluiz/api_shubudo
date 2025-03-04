import kata from "../models/kataModel.js";

class kataController {
    static async listarkatas(req, res) {
        try {
            const lista = await kata.find({});
            res.status(200).json(lista);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar katas`
            });
        }
    }

    static async listarKataPorCor(req, res) {
        const faixa = req.query.faixa;
        try {
            const katasDaFaixa = await kata.find({ faixa: faixa });
            res.status(200).json(katasDaFaixa);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }

    static async atualizarKata(req, res) {
        try {
            // Espera que o body seja um array de objetos,
            // onde cada objeto possui um "id" e os campos a serem atualizados.
            const kataUpdates = req.body;

            if (!Array.isArray(kataUpdates)) {
                return res.status(400).json({ message: 'O body deve ser um array de katas para atualizar.' });
            }

            // Atualiza todos os katas em paralelo utilizando Promise.all
            const results = await Promise.all(
                kataUpdates.map(async (updateObj) => {
                    const { id, ...updateFields } = updateObj;
                    if (!id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "id".');
                    }
                    // Atualiza o kata e retorna o documento atualizado (opção { new: true } para retornar o documento novo)
                    return await kata.findByIdAndUpdate(id, updateFields, { new: true });
                })
            );

            res.status(200).json({ message: 'Katas atualizados com sucesso', data: results });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message}` });
        }
    }

    static async excluirKata(req, res) {
        try {
            await kata.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }

    static async cadastrarKata(req, res) {
        try {
            const novo = await kata.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Kata: novo
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }
}

export default kataController;
