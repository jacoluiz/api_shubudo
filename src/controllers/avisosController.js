import Aviso from "../models/avisoModel.js";

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

  // Atualizar aviso por ID via /avisos/:id
  static async atualizarAviso(req, res) {
    try {
      const { id } = req.params;
      const avisoAtualizado = await Aviso.findByIdAndUpdate(id, req.body, { new: true });
      if (!avisoAtualizado) {
        return res.status(404).json({ message: "Aviso não encontrado." });
      }
      res.status(200).json(avisoAtualizado);
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - Erro ao atualizar aviso.` });
    }
  }

  // Atualização em lote via PUT /avisos
  static async atualizarAvisosEmLote(req, res) {
    try {
      const atualizacoes = req.body; // Deve ser um array de objetos com { id, ...dados }

      if (!Array.isArray(atualizacoes) || atualizacoes.length === 0) {
        return res.status(400).json({ message: "Envie uma lista de avisos para atualizar." });
      }

      const resultados = [];

      for (const atualizacao of atualizacoes) {
        const { id, ...dadosAtualizados } = atualizacao;
        if (!id) continue;

        const atualizado = await Aviso.findByIdAndUpdate(id, dadosAtualizados, { new: true });
        if (atualizado) resultados.push(atualizado);
      }

      res.status(200).json({
        message: "Avisos atualizados com sucesso.",
        atualizados: resultados,
      });
    } catch (erro) {
      res.status(500).json({ message: `${erro.message} - Erro ao atualizar avisos em lote.` });
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
