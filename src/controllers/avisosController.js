import Aviso from "../models/avisosModel.js";

class AvisoController {
  // Listar todos os avisos
  static async listarAvisos(req, res) {
    try {
      const avisos = await Aviso.find();
      res.status(200).json(avisos);
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - Erro ao listar avisos.` });
    }
  }

  // Buscar um aviso por ID
  static async buscarAvisoPorId(req, res) {
    try {
      const aviso = await Aviso.findById(req.params.id);
      if (!aviso) {
        return res.status(404).json({ message: "Aviso não encontrado." });
      }
      res.status(200).json(aviso);
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - Erro ao buscar aviso.` });
    }
  }

  // Cadastrar um novo aviso
  static async cadastrarAviso(req, res) {
    try {
      // Cria uma nova instância do aviso com os dados enviados no body da requisição
      const novoAviso = new Aviso(req.body);
      await novoAviso.save();

      res.status(201).json({
        message: "Aviso criado com sucesso.",
        aviso: novoAviso,
      });
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - Erro ao cadastrar aviso.` });
    }
  }

  // Atualizar um aviso existente
  static async atualizarAviso(req, res) {
    try {
      const { id } = req.params;
      // O parâmetro { new: true } retorna o documento após a atualização
      const avisoAtualizado = await Aviso.findByIdAndUpdate(id, req.body, { new: true });
      if (!avisoAtualizado) {
        return res.status(404).json({ message: "Aviso não encontrado." });
      }
      res.status(200).json(avisoAtualizado);
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - Erro ao atualizar aviso.` });
    }
  }

  // Excluir um aviso
  static async excluirAviso(req, res) {
    try {
      const { id } = req.params;
      await Aviso.findByIdAndDelete(id);
      res.status(200).json({ message: "Aviso excluído com sucesso." });
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - Erro ao excluir aviso.` });
    }
  }
}

export default AvisoController;
