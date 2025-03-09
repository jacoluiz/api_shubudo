import projecao from "../models/projecoesModel.js";

class ProjecaoController {
    // Criar uma projeção
    static async criar(req, res) {
        try {
            const novaProjecao = new projecao(req.body);
            await novaProjecao.save();
            res.status(201).json({
                message: "Projeção criada com sucesso.",
                projecao: novaProjecao,
            });
        } catch (error) {
            res.status(500).json({
                message: `Erro ao criar projeção: ${error.message}`,
            });
        }
    }

    // Listar todas as projeções
    static async listar(req, res) {
        try {
            const projecoes = await projecao.find().populate("faixa");
            res.status(200).json(projecoes);
        } catch (error) {
            res.status(500).json({
                message: `Erro ao listar projeções: ${error.message}`,
            });
        }
    }

    // Buscar projeção por ID
    static async buscarPorId(req, res) {
        try {
            const projecaoEncontrada = await projecao.findById(req.params.id).populate("faixa");
            if (projecaoEncontrada) {
                res.status(200).json(projecaoEncontrada);
            } else {
                res.status(404).json({ message: "Projeção não encontrada." });
            }
        } catch (error) {
            res.status(500).json({
                message: `Erro ao buscar projeção: ${error.message}`,
            });
        }
    }

    // Atualizar múltiplas projeções
    static async atualizar(req, res) {
        try {
            // O body deve ser um array de objetos contendo "_id" e os campos a serem atualizados
            const projecoesAtualizar = req.body;

            if (!Array.isArray(projecoesAtualizar)) {
                return res.status(400).json({ message: "O body deve ser um array de projeções para atualizar." });
            }

            // Atualiza todas as projeções em paralelo utilizando Promise.all
            const resultados = await Promise.all(
                projecoesAtualizar.map(async (updateObj) => {
                    const { _id, ...updateFields } = updateObj;
                    if (!_id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "_id".');
                    }
                    return await projecao.findByIdAndUpdate(_id, updateFields, { new: true }).populate("faixa");
                })
            );

            res.status(200).json({ message: "Projeções atualizadas com sucesso.", data: resultados });
        } catch (error) {
            res.status(500).json({ message: `Erro ao atualizar projeções: ${error.message}` });
        }
    }

    // Excluir uma projeção
    static async excluir(req, res) {
        try {
            const projecaoExcluida = await projecao.findByIdAndDelete(req.params.id);
            if (projecaoExcluida) {
                res.status(200).json({ message: "Projeção excluída com sucesso." });
            } else {
                res.status(404).json({ message: "Projeção não encontrada." });
            }
        } catch (error) {
            res.status(500).json({
                message: `Erro ao excluir projeção: ${error.message}`,
            });
        }
    }
}

export default ProjecaoController;
