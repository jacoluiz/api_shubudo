import DateEvent from "../models/dataModel.js";

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
