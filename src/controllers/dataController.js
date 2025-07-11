import DateEvent from "../models/dateModel.js";

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
}

export default dateController;
