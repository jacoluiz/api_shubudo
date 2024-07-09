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
            })
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
            })
        }
    };

    static async atualizarChute(req, res) {
        try {
            await chute.findByIdAndUpdate(req.params.id, req.body);
            res.status(200).json({ message: "Atualizado com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

    static async excluirChute(req, res) {
        try {
            await chute.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Excluído com sucesso" });
        }
        catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            })
        }
    }

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
            })
        }
    }
}

export default chuteController