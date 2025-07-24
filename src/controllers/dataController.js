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
      const novaData = await DateEvent.create(req.body);

      // Buscar todos os usuários com token válido
      const usuarios = await Usuario.find({ fcmToken: { $ne: null } });

      const tokens = usuarios.map(u => u.fcmToken);

      if (tokens.length > 0) {
        for (const token of tokens) {
          await enviarPushParaUsuario(
            token,
            "Novo evento adicionado",
            "Ei! Tem evento no no aplicativo. Confira!"
          );
        }
      }

      res.status(201).json({
        message: "Data criada com sucesso",
        data: novaData
      });
    } catch (erro) {
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
