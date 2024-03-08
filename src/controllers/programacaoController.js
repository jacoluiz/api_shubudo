import programacao from "../models/programacaoModel.js";

class programacaoController{
    static async listarProgramacao(req, res){
        const listaProgramacao = await programacao.find({});
        res.status(200).json(listaProgramacao);
    };

    static async cadastrarProgramacao(req, res){
        try{
            const novaProgramacao = await programacao.create(req.body);
            res.status(201).json({
                message: "Criado com sucesso",
                programacao: novaProgramacao
            });
        }
        catch(erro){
            res.estatus(500).json({
                message: `${erro.message}`
            })
        }
    }
}

export default programacaoController