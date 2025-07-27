import GaleriaEvento from "../models/galeriaEventoModel.js";
import Usuario from "../models/usuarioModel.js";
import GaleriaFoto from "../models/galeriaFotoModel.js";
import { enviarPushParaUsuario } from "./notificacaoController.js";

import AWS from "aws-sdk";

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

class GaleriaEventoController {
    static async listarEventos(req, res) {
        try {
            const eventos = await GaleriaEvento.find({});
            res.status(200).json(eventos);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Erro ao listar eventos da galeria` });
        }
    }

    static async criarEvento(req, res) {
        try {
            const novoEvento = await GaleriaEvento.create(req.body);

            // Buscar todos os usuários com token válido
            const usuarios = await Usuario.find({ fcmToken: { $ne: null } });
            const tokens = usuarios.map(u => u.fcmToken);

            for (const token of tokens) {
                await enviarPushParaUsuario(
                    token,
                    "Nova galeria adicionada",
                    "Um novo evento com fotos foi adicionado. Confira!"
                );
            }

            res.status(201).json({
                message: "Evento da galeria criado com sucesso",
                evento: novoEvento
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao criar evento da galeria`
            });
        }
    }

    static async atualizarEvento(req, res) {
        try {
            const { id } = req.params;
            const eventoAtualizado = await GaleriaEvento.findByIdAndUpdate(id, req.body, { new: true });

            if (!eventoAtualizado) {
                return res.status(404).json({ message: "Evento da galeria não encontrado" });
            }

            res.status(200).json({
                message: "Evento atualizado com sucesso",
                evento: eventoAtualizado
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao atualizar evento da galeria`
            });
        }
    }

    static async deletarEvento(req, res) {
        try {
            const { id } = req.params;

            // 1. Buscar todas as fotos associadas ao evento
            const fotos = await GaleriaFoto.find({ eventoId: id });

            // 2. Deletar cada imagem do S3
            for (const foto of fotos) {
                const urlParts = foto.url.split("/");
                const key = urlParts.slice(3).join("/"); // extrai o caminho relativo do arquivo

                await s3.deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key
                }).promise();
            }

            // 3. Deletar os registros das fotos no MongoDB
            await GaleriaFoto.deleteMany({ eventoId: id });

            // 4. Deletar o evento
            const eventoRemovido = await GaleriaEvento.findByIdAndDelete(id);

            if (!eventoRemovido) {
                return res.status(404).json({ message: "Evento da galeria não encontrado" });
            }

            res.status(200).json({
                message: "Evento e fotos deletados com sucesso"
            });
        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - Erro ao deletar evento da galeria`
            });
        }
    }
}

export default GaleriaEventoController;
