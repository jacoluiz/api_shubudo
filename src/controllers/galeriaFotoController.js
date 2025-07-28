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
            const fotos = await GaleriaFoto.find({ eventoId: eventoId });
            res.status(200).json(fotos);
        } catch (err) {
            res.status(500).json({ message: "Erro ao listar fotos", error: err.message });
        }
    }

    static async enviarFoto(req, res) {
        console.log("📥 [API] Iniciando upload de fotos");

        try {
            const files = req.files;
            const { eventoId } = req.params;
            const { academiaId, usuarioId } = req.body;

            console.log("🧾 Dados recebidos:");
            console.log("  - eventoId:", eventoId);
            console.log("  - academiaId:", academiaId);
            console.log("  - usuarioId:", usuarioId);
            console.log("  - files:", files?.length || 0);

            if (!files || files.length === 0 || !eventoId || !academiaId || !usuarioId) {
                console.warn("⚠️ Dados incompletos para envio das fotos");
                return res.status(400).json({ message: "Dados incompletos para envio das fotos" });
            }

            const novasFotos = [];

            for (const [index, file] of files.entries()) {
                try {
                    console.log(`📤 Enviando foto ${index + 1} para o S3...`);
                    const s3Path = `galeria/${academiaId}/${eventoId}/${Date.now()}`;

                    const uploadResult = await s3.upload({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: s3Path,
                        Body: file.buffer,
                        ContentType: file.mimetype
                    }).promise();

                    console.log("✅ Upload S3 concluído:", uploadResult.Location);

                    const novaFoto = await GaleriaFoto.create({
                        eventoId,
                        url: uploadResult.Location,
                        uploadedBy: usuarioId
                    });

                    console.log("🖼️ Foto salva no banco:", novaFoto._id);

                    novasFotos.push(novaFoto);
                } catch (uploadErr) {
                    console.error(`❌ Erro ao processar a foto ${index + 1}:`, uploadErr.message);
                }
            }

            console.log("🔔 Enviando notificações push...");

            const usuarios = await Usuario.find({ fcmToken: { $ne: null } });

            for (const usuario of usuarios) {
                try {
                    await enviarPushParaUsuario(
                        usuario.fcmToken,
                        "Novas fotos na galeria!",
                        "Momentos incríveis foram adicionados. Vá conferir!"
                    );
                    console.log(`📲 Notificação enviada para ${usuario.email}`);
                } catch (err) {
                    if (
                        err.code === "messaging/registration-token-not-registered" ||
                        err.errorInfo?.code === "messaging/registration-token-not-registered"
                    ) {
                        console.warn(`⚠️ Token inválido detectado: ${usuario.fcmToken}`);
                        await Usuario.findByIdAndUpdate(usuario._id, {
                            $unset: { fcmToken: "" }
                        });
                    } else {
                        console.error("❌ Erro ao enviar push:", err);
                    }
                }
            }

            console.log("✅ Upload finalizado com sucesso. Total:", novasFotos.length);

            res.status(201).json({
                message: "Fotos enviadas com sucesso",
                data: novasFotos
            });

        } catch (err) {
            console.error("🔥 Erro inesperado ao enviar fotos:", err);
            res.status(500).json({ message: "Erro ao enviar fotos", error: err.message });
        }
    }

    static async deletarFotos(req, res) {
        try {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: "Lista de IDs inválida" });
            }

            const fotos = await GaleriaFoto.find({ _id: { $in: ids } });

            if (fotos.length === 0) {
                return res.status(404).json({ message: "Nenhuma foto encontrada" });
            }

            const errosS3 = [];

            await Promise.all(fotos.map(async (foto) => {
                try {
                    const urlParts = foto.url.split("/");
                    const key = decodeURIComponent(urlParts.slice(3).join("/"));

                    console.log("Deletando S3 key:", key);

                    await s3.deleteObject({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: key
                    }).promise();
                } catch (err) {
                    errosS3.push(foto._id);
                }
            }));

            if (errosS3.length > 0) {
                return res.status(500).json({
                    message: "Erro ao deletar algumas fotos no S3",
                    falhas: errosS3
                });
            }

            await GaleriaFoto.deleteMany({ _id: { $in: ids } });

            res.status(200).json({ message: "Fotos deletadas com sucesso" });
        } catch (err) {
            res.status(500).json({ message: "Erro ao deletar fotos", error: err.message });
        }
    }
}

export default GaleriaFotoController;
