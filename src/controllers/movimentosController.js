import { chute, ataqueMao, defesa } from '../models/movimentoPadraoModel.js';

class MovimentoController {
    static async atualizarMovimentos(req, res) {
        try {
            const updates = req.body;

            const updatePromises = updates.map(update => {
                const { _id, tipoMovimento, ...rest } = update;
                let model;

                switch (tipoMovimento) {
                    case 'Chute':
                        model = chute;
                        break;
                    case 'Ataque de mão':
                        model = ataqueMao;
                        break;
                    case 'Defesa':
                        model = defesa;
                        break;
                    default:
                        throw new Error(`Tipo de movimento desconhecido: ${tipoMovimento}`);
                }
                return MovimentoController.atualizarMovimento(model, _id, rest);
            });

            const updatedMovimentos = await Promise.all(updatePromises);

            res.status(200).json({ message: "Atualizados com sucesso", data: updatedMovimentos });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message}`
            });
        }
    }

    static async atualizarAtaquesDeMao(req, res) {
        try {
            const result = await MovimentoController.atualizarMovimento(ataqueMao, req.params.id, req.body);
            res.status(200).json(result);
        } catch (erro) {
            res.status(500).json({
                message: erro.message
            });
        }
    }

    static async atualizarChutes(req, res) {
        try {
            const result = await MovimentoController.atualizarMovimento(chute, req.params.id, req.body);
            res.status(200).json(result);
        } catch (erro) {
            res.status(500).json({
                message: erro.message
            });
        }
    }

    static async atualizarDefesas(req, res) {
        try {
            const result = await MovimentoController.atualizarMovimento(defesa, req.params.id, req.body);
            res.status(200).json(result);
        } catch (erro) {
            res.status(500).json({
                message: erro.message
            });
        }
    }

    static async atualizarMovimento(model, id, data) {
        try {
            const updatedMovimento = await model.findByIdAndUpdate(id, data, { new: true });
            return { message: "Atualizado com sucesso", data: updatedMovimento };
        } catch (erro) {
            throw new Error(erro.message);
        }
    }
}

export default MovimentoController;
