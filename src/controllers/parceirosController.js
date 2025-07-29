import Parceiro from "../models/parceirosModel.js";

class parceiroController {
  static async listarParceiros(req, res) {
    try {
      const lista = await Parceiro.find({});
      res.status(200).json(lista);
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao listar parceiros`
      });
    }
  }

  static async criarParceiro(req, res) {
    try {
      const novoParceiro = await Parceiro.create(req.body);
      res.status(201).json({
        message: "Parceiro criado com sucesso",
        data: novoParceiro
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao criar parceiro`
      });
    }
  }

  static async atualizarParceiro(req, res) {
    try {
      const { id } = req.params;
      const parceiroAtualizado = await Parceiro.findByIdAndUpdate(id, req.body, { new: true });

      if (!parceiroAtualizado) {
        return res.status(404).json({ message: "Parceiro não encontrado" });
      }

      res.status(200).json({
        message: "Parceiro atualizado com sucesso",
        data: parceiroAtualizado
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao atualizar parceiro`
      });
    }
  }

  static async deletarParceiro(req, res) {
    try {
      const { id } = req.params;
      const parceiroRemovido = await Parceiro.findByIdAndDelete(id);

      if (!parceiroRemovido) {
        return res.status(404).json({ message: "Parceiro não encontrado" });
      }

      res.status(200).json({
        message: "Parceiro deletado com sucesso"
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Erro ao deletar parceiro`
      });
    }
  }
}

export default parceiroController;