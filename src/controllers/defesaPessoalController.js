import { defesaPessoal as sequenciaDeCombate } from "../models/defesaPessoalESequenciaModel.js";

class defesaPessoalController {
    static async listarDefesasPessoal(req, res) {
        try {
            const listaDefesas = await sequenciaDeCombate.find({});
            res.status(200).json(listaDefesas);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar`
            });
        }
    }

    static async listarDefesasPessoalPorCor(req, res) {
        const faixa = req.query.faixa;
        try {
            const defesasDaFaixa = await sequenciaDeCombate.find({ faixa: faixa });
            res.status(200).json(defesasDaFaixa);
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }

    // Método para atualizar múltiplas defesas pessoais, adicionando o campo "video"
    static async atualizarDefesaPessoal(req, res) {
        try {
            // O body deve ser um array de objetos contendo "_id" e "video"
            const updates = req.body;

            if (!Array.isArray(updates)) {
                return res.status(400).json({ message: "O body deve ser um array de defesas para atualizar." });
            }

            // Atualiza todas as defesas em paralelo
            const results = await Promise.all(
                updates.map(async (updateObj) => {
                    const { _id, video } = updateObj;
                    if (!_id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "_id".');
                    }
                    // Atualiza a defesa pessoal com o campo video e retorna o documento atualizado
                    return await sequenciaDeCombate.findByIdAndUpdate(_id, { video }, { new: true });
                })
            );

            res.status(200).json({ message: "Defesas pessoais atualizadas com sucesso.", data: results });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message}` });
        }
    }

    static async excluirDefesaPessoal(req, res) {
        try {
            await sequenciaDeCombate.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }

    static async cadastrarDefesaPessoal(req, res) {
        try {
            const novaDefesa = await sequenciaDeCombate.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Defesa_pessoal: novaDefesa
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }
}

export default defesaPessoalController;
