import { defesaPessoal as sequenciaDeCombate } from "../models/defesaPessoalESequenciaModel.js";

class defesaPessoalController {
    static async listarDefesasPessoal(req, res) {
        try {
            const listaDefesas = await sequenciaDeCombate.find({});
            res.status(200).json(listaDefesas);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar`
            })
        }
    };

    static async listarDefesasPessoalPorCor(req, res) {
        const faixa = req.query.faixa;
        try {
            const defesasDaFaixa = await sequenciaDeCombate.find({ faixa: faixa });
            res.status(200).json(defesasDaFaixa);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    };

    static async atualizarDefesaPessoal(req, res) {
        try {
            await sequenciaDeCombate.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: "Atualizado com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async excluirDefesaPessoal(req, res) {
        try {
            await sequenciaDeCombate.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async cadastrarDefesaPessoal(req, res) {
        try {
            const novaDefesa = await sequenciaDeCombate.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Defesa_pessoal: novaDefesa
            });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }
}

export default defesaPessoalController