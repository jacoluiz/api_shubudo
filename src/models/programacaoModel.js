import mongoose from "mongoose";

const programacaoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    faixa: { type: mongoose.Schema.Types.ObjectId, ref: 'faixa', required: true },
    defesa: { type: String },
    ataquesDeMao: { type: String },
    chutes: { type: String },
    defesaPessoal: { type: String },
    sequenciaDeCombate: { type: String },
    katas: { type: String },

}, {versionKey: false});

const programacao = mongoose.model("programacao", programacaoSchema);

export default programacao;