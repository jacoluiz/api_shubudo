import DateEvent from "../models/dataModel.js";
import Usuario from "../models/usuarioModel.js";
import { enviarPushParaUsuario } from "../controllers/notificacaoController.js";

class dateController {
  static async listarDatas(req, res) {
    try {
      const lista = await DateEvent.find({});
      res.status(200).json(lista);
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao listar datas`
      });
    }
  }

  static async criarData(req, res) {
    try {
      console.log("🔄 Iniciando criação de nova data...");
      console.log("📦 Payload recebido:", req.body);

      const novaData = await DateEvent.create(req.body);
      console.log("✅ Evento criado com sucesso:", novaData);

      const idAcademia = req.body.academia;
      if (!idAcademia) {
        throw new Error("O campo 'academia' é obrigatório.");
      }

      // Buscar todos os usuários com token válido e academiaId correspondente
      const usuarios = await Usuario.find({
        fcmToken: { $ne: null },
        academiaId: idAcademia
      });

      console.log(`🔍 ${usuarios.length} usuários encontrados com fcmToken e academiaId = ${idAcademia}`);

      for (const usuario of usuarios) {
        try {
          console.log(`📲 Enviando notificação para: ${usuario.nome} (${usuario.email}) - token: ${usuario.fcmToken}`);
          await enviarPushParaUsuario(
            usuario.fcmToken,
            "Novo evento adicionado",
            "Ei! Tem evento novo no aplicativo. Confira!"
          );
          console.log(`✅ Notificação enviada com sucesso para token: ${usuario.fcmToken}`);
        } catch (erroNotificacao) {
          console.error(`❌ Erro ao enviar push para token ${usuario.fcmToken}:`, erroNotificacao.message);

          if (erroNotificacao.code === 'messaging/registration-token-not-registered') {
            console.warn(`⚠️ Token inválido detectado: ${usuario.fcmToken}`);
            continue; // ignora token inválido
          } else {
            console.warn("⚠️ Erro inesperado no envio de push:", erroNotificacao);
            continue; // segue mesmo com erro
          }
        }
      }

      res.status(201).json({
        message: "Data criada com sucesso",
        data: novaData
      });
    } catch (erro) {
      console.error("❌ Erro ao criar data:", erro.message);
      console.error("🪵 Stack trace:", erro.stack);
      res.status(500).json({
        message: `${erro.message} - Erro ao criar data`
      });
    }
  }

  static async atualizarData(req, res) {
    try {
      const { id } = req.params;
      const dataAtualizada = await DateEvent.findByIdAndUpdate(id, req.body, { new: true });

      if (!dataAtualizada) {
        return res.status(404).json({ message: "Data não encontrada" });
      }

      res.status(200).json({
        message: "Data atualizada com sucesso",
        data: dataAtualizada
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao atualizar data`
      });
    }
  }

  static async deletarData(req, res) {
    try {
      const { id } = req.params;
      const dataRemovida = await DateEvent.findByIdAndDelete(id);

      if (!dataRemovida) {
        return res.status(404).json({ message: "Data não encontrada" });
      }

      res.status(200).json({
        message: "Data deletada com sucesso"
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao deletar data`
      });
    }
  }
}

export default dateController;
