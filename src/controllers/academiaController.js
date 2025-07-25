import Academia from "../models/academiaModel.js";

class AcademiaController {
  static async listarAcademias(req, res) {
    try {
      const academias = await Academia.find({});
      res.status(200).json(academias);
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao listar academias`
      });
    }
  }

  static async criarAcademia(req, res) {
    try {
      const novaAcademia = await Academia.create(req.body);
      res.status(201).json({
        message: "Academia criada com sucesso",
        data: novaAcademia
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao criar academia`
      });
    }
  }

  static async atualizarAcademia(req, res) {
    try {
      const { id } = req.params;
      const academiaAtualizada = await Academia.findByIdAndUpdate(id, req.body, { new: true });

      if (!academiaAtualizada) {
        return res.status(404).json({ message: "Academia não encontrada" });
      }

      res.status(200).json({
        message: "Academia atualizada com sucesso",
        data: academiaAtualizada
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao atualizar academia`
      });
    }
  }

  static async deletarAcademia(req, res) {
    try {
      const { id } = req.params;
      const academiaRemovida = await Academia.findByIdAndDelete(id);

      if (!academiaRemovida) {
        return res.status(404).json({ message: "Academia não encontrada" });
      }

      res.status(200).json({
        message: "Academia deletada com sucesso"
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao deletar academia`
      });
    }
  }
}

export default AcademiaController;
