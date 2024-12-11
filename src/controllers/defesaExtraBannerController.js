import { defesaPessoalExtraBanner } from "../models/defesaPessoalESequenciaModel.js";

class DefesaPessoalExtraBannerController {
    // Criar um registro
    static async criar(req, res) {
        try {
            const novoRegistro = new defesaPessoalExtraBanner(req.body);
            await novoRegistro.save();
            res.status(201).json({
                message: "Registro criado com sucesso.",
                registro: novoRegistro,
            });
        } catch (error) {
            res.status(500).json({
                message: `Erro ao criar registro: ${error.message}`,
            });
        }
    }

    // Listar todos os registros
    static async listar(req, res) {
        try {
            const registros = await defesaPessoalExtraBanner
                .find()
                .populate("faixa");
            res.status(200).json(registros);
        } catch (error) {
            res.status(500).json({
                message: `Erro ao listar registros: ${error.message}`,
            });
        }
    }

    // Buscar por ID
    static async buscarPorId(req, res) {
        try {
            const registro = await defesaPessoalExtraBanner
                .findById(req.params.id)
                .populate("faixa");
            if (registro) {
                res.status(200).json(registro);
            } else {
                res.status(404).json({ message: "Registro não encontrado." });
            }
        } catch (error) {
            res.status(500).json({
                message: `Erro ao buscar registro: ${error.message}`,
            });
        }
    }

    // Atualizar um registro
    static async atualizar(req, res) {
        try {
            const registroAtualizado = await defesaPessoalExtraBanner.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            ).populate("faixa");
            if (registroAtualizado) {
                res.status(200).json({
                    message: "Registro atualizado com sucesso.",
                    registro: registroAtualizado,
                });
            } else {
                res.status(404).json({ message: "Registro não encontrado." });
            }
        } catch (error) {
            res.status(500).json({
                message: `Erro ao atualizar registro: ${error.message}`,
            });
        }
    }

    // Excluir um registro
    static async excluir(req, res) {
        try {
            const registroExcluido = await defesaPessoalExtraBanner.findByIdAndDelete(
                req.params.id
            );
            if (registroExcluido) {
                res.status(200).json({ message: "Registro excluído com sucesso." });
            } else {
                res.status(404).json({ message: "Registro não encontrado." });
            }
        } catch (error) {
            res.status(500).json({
                message: `Erro ao excluir registro: ${error.message}`,
            });
        }
    }
}

export default DefesaPessoalExtraBannerController;
