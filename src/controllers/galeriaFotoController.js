import GaleriaFoto from "../models/galeriaFotoModel.js";
import Usuario from "../models/usuarioModel.js";
import AWS from "aws-sdk";
import { enviarPushParaUsuario } from "./notificacaoController.js";

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

class GaleriaFotoController {
    static async listarPorEvento(req, res) {
        try {
            const { eventoId } = req.params;
            const fotos = await GaleriaFoto.find({ evento: eventoId });
            res.status(200).json(fotos);
        } catch (err) {
            res.status(500).json({ message: "Erro ao listar fotos", error: err.message });
        }
    }

    static async enviarFoto(req, res) {
        try {
            const file = req.file;
            const { eventoId } = req.params;
            const { academiaId, usuarioId } = req.body;

            if (!file || !eventoId || !academiaId || !usuarioId) {
                return res.status(400).json({ message: "Dados incompletos para envio da foto" });
            }

            const s3Path = `galeria/${academiaId}/${eventoId}/${Date.now()}-${file.originalname}`;

            const uploadResult = await s3.upload({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: s3Path,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read"
            }).promise();

            const novaFoto = await GaleriaFoto.create({
                evento: eventoId,
                url: uploadResult.Location,
                uploadedBy: usuarioId
            });

            // Enviar push para todos usuários com FCM Token
            const usuarios = await Usuario.find({ fcmToken: { $ne: null } });
            for (const usuario of usuarios) {
                await enviarPushParaUsuario(
                    usuario.fcmToken,
                    "Nova foto na galeria!",
                    "Um novo momento foi registrado. Vá conferir na galeria!"
                );
            }

            res.status(201).json({
                message: "Foto enviada com sucesso",
                data: novaFoto
            });

        } catch (err) {
            res.status(500).json({ message: "Erro ao enviar foto", error: err.message });
        }
    }

    static async deletarFoto(req, res) {
        try {
            const { id } = req.params;
            const foto = await GaleriaFoto.findById(id);

            if (!foto) return res.status(404).json({ message: "Foto não encontrada" });

            // Extrair o caminho (Key) do S3 a partir da URL
            const urlParts = foto.url.split("/");
            const key = urlParts.slice(3).join("/");

            // Excluir do S3
            await s3.deleteObject({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key
            }).promise();

            await GaleriaFoto.findByIdAndDelete(id);

            res.status(200).json({ message: "Foto deletada com sucesso" });
        } catch (err) {
            res.status(500).json({ message: "Erro ao deletar foto", error: err.message });
        }
    }
}

export default GaleriaFotoController;
