import programacao from "../models/programacaoModel.js";

class programacaoController {
    static async listarProgramacao(req, res) {
        try {
            const listaProgramacao = await programacao.find({});
            res.status(200).json(listaProgramacao);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar programação`
            })
        }
    };

    static async listarProgramacaoPorId(req, res) {
        try {
            const programacoes = await programacao.findById(req.params.id);
            res.status(200).json(programacoes);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    };

    static async listarProgramacaoPorFaixa(req, res) {
        const faixa = req.query.faixa;
        try {
            const programacaoEncontrada = await programacao.find({ faixa: faixa });
            res.status(200).json(programacaoEncontrada);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    };

    static async atualizarProgramacao(req, res) {
        try {
            await programacao.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: "Atualizado com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async excluirProgramacao(req, res) {
        try {
            await programacao.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async cadastrarProgramacao(req, res) {
        try {
            const novaProgramacao = await programacao.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                programacao: novaProgramacao
            });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }
}

export default programacaoController