import faixa from "../models/faixasModel.js";

class faixaController {
    static async listarFaixas(req, res) {
        try {
            const listaFaixas = await faixa.find({});
            res.status(200).json(listaFaixas);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao listar programação`
            })
        }
    };

    static async listarFaixaPorCor(req, res) {
        const faixaSolicitada = req.query.faixa;
        try {
            const faixaEncontrada = await faixa.find({ faixa: faixaSolicitada });
            res.status(200).json(faixaEncontrada);
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    };

    static async atualizarFaixa(req, res) {
        try {
            await faixa.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: "Atualizado com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async excluirFaixa(req, res) {
        try {
            await faixa.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async cadastrarFaixa(req, res) {
        try {
            const novaFaixa = await faixa.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                Faixa: novaFaixa
            });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }
}

export default faixaController