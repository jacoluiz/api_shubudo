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
            const projecao = await projecao.findById(req.params.id).populate("faixa");
            if (projecao) {
                res.status(200).json(projecao);
            } else {
                res.status(404).json({ message: "Projeção não encontrada." });
            }
        } catch (error) {
            res.status(500).json({
                message: `Erro ao buscar projeção: ${error.message}`,
            });
        }
    }

    // Atualizar uma projeção
    static async atualizar(req, res) {
        try {
            const projecaoAtualizada = await projecao.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            ).populate("faixa");
            if (projecaoAtualizada) {
                res.status(200).json({
                    message: "Projeção atualizada com sucesso.",
                    projecao: projecaoAtualizada,
                });
            } else {
                res.status(404).json({ message: "Projeção não encontrada." });
            }
        } catch (error) {
            res.status(500).json({
                message: `Erro ao atualizar projeção: ${error.message}`,
            });
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
