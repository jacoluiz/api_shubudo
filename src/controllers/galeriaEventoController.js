import GaleriaEvento from "../models/galeriaEventoModel.js";
import Usuario from "../models/usuarioModel.js";
import GaleriaFoto from "../models/galeriaFotoModel.js";
import GaleriaFotoController from "./galeriaFotoController.js";
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
            console.log("🔄 Iniciando criação de novo evento de galeria...");
            console.log("📦 Payload recebido:", req.body);

            const novoEvento = await GaleriaEvento.create(req.body);
            console.log("✅ Evento da galeria criado com sucesso:", novoEvento);

            const idAcademia = req.body.academiaId;
            if (!idAcademia) {
                throw new Error("O campo 'academiaId' é obrigatório no payload.");
            }

            // Buscar todos os usuários com token válido e academia correspondente
            const usuarios = await Usuario.find({
                fcmToken: { $ne: null },
                academiaId: idAcademia
            });

            console.log(`🔍 ${usuarios.length} usuários encontrados com fcmToken e academiaId = ${idAcademia}`);

            for (const usuario of usuarios) {
                try {
                    console.log(`📤 Enviando push para: ${usuario.nome} (${usuario.email}) - token: ${usuario.fcmToken}`);
                    await enviarPushParaUsuario(
                        usuario.fcmToken,
                        "Nova galeria adicionada",
                        "Um novo evento com fotos foi adicionado. Confira!"
                    );
                    console.log(`✅ Notificação enviada com sucesso para token: ${usuario.fcmToken}`);
                } catch (erroNotificacao) {
                    console.error(`❌ Erro ao enviar push para token ${usuario.fcmToken}:`, erroNotificacao.message);

                    if (erroNotificacao.code === 'messaging/registration-token-not-registered') {
                        console.warn(`⚠️ Token inválido detectado: ${usuario.fcmToken}`);
                    } else {
                        console.warn("⚠️ Erro inesperado no envio de push:", erroNotificacao);
                    }

                    continue; // ignora erro e segue para os demais
                }
            }

            res.status(201).json({
                message: "Evento da galeria criado com sucesso",
                evento: novoEvento
            });
        } catch (erro) {
            console.error("❌ Erro ao criar evento da galeria:", erro.message);
            console.error("🪵 Stack trace:", erro.stack);
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

            // Buscar IDs de todas as fotos associadas ao evento
            const fotos = await GaleriaFoto.find({ eventoId: id });
            const idsDasFotos = fotos.map(f => f._id.toString());

            // Reutiliza o método de deletar fotos do controller
            if (idsDasFotos.length > 0) {
                // Simula uma req/res com os dados necessários
                const reqFotos = { body: { ids: idsDasFotos } };
                const resFotos = {
                    status: (code) => ({
                        json: (data) => {
                            if (code >= 400) {
                                throw new Error(data.message || "Erro ao deletar fotos");
                            }
                        }
                    })
                };
                await GaleriaFotoController.deletarFotos(reqFotos, resFotos);
            }

            // Deletar o evento
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
