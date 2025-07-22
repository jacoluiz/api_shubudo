import TecnicaChao from "../models/tecnicaChaoModel.js";

class TecnicaChaoController {
    // Listar todas as técnicas
    static async listarTecnicas(req, res) {
        try {
            const lista = await TecnicaChao.find({});
            res.status(200).json(lista);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar técnicas de chão`
            });
        }
    }

    // Listar técnicas por faixa
    static async listarTecnicasPorFaixa(req, res) {
        const faixa = req.query.faixa;
        try {
            const tecnicas = await TecnicaChao.find({ faixa });
            res.status(200).json(tecnicas);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message}` });
        }
    }

    // Atualizar técnicas (espera um array de objetos com _id e campos a atualizar)
    static async atualizarTecnica(req, res) {
        try {
            const tecnicaUpdates = req.body;
            if (!Array.isArray(tecnicaUpdates)) {
                return res.status(400).json({ message: 'O body deve ser um array de técnicas para atualizar.' });
            }
            const results = await Promise.all(
                tecnicaUpdates.map(async (updateObj) => {
                    const { _id, ...updateFields } = updateObj;
                    if (!_id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "_id".');
                    }
                    return await TecnicaChao.findByIdAndUpdate(_id, updateFields, { new: true });
                })
            );
            res.status(200).json({ message: 'Técnicas de chão atualizadas com sucesso', data: results });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message}` });
        }
    }

    // Excluir uma técnica
    static async excluirTecnica(req, res) {
        try {
            await TecnicaChao.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message}` });
        }
    }

    // Cadastrar uma nova técnica
    static async cadastrarTecnica(req, res) {
        try {
            const nova = await TecnicaChao.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                tecnica: nova
            });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message}` });
        }
    }
}

export default TecnicaChaoController;
