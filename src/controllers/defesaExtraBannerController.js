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

    static async atualizar(req, res) {
        try {
            const { registros } = req.body;

            if (!registros || !Array.isArray(registros) || registros.length === 0) {
                return res.status(400).json({ message: "Nenhum registro enviado para atualização." });
            }

            const registrosAtualizados = await Promise.all(
                registros.map(async (registro) => {
                    const { _id, ...updateFields } = registro;
                    if (!_id) {
                        throw new Error('Cada objeto de atualização deve conter o campo "_id".');
                    }
                    const atualizado = await defesaPessoalExtraBanner.findByIdAndUpdate(
                        _id,
                        updateFields,
                        { new: true }
                    ).populate("faixa");
                    if (!atualizado) {
                        throw new Error(`Registro com _id ${_id} não encontrado.`);
                    }
                    return atualizado;
                })
            );

            res.status(200).json({ message: 'Registros atualizados com sucesso', registros: registrosAtualizados });
        } catch (error) {
            res.status(500).json({
                message: `Erro ao atualizar registros: ${error.message}`,
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
