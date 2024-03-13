import mongoose from "mongoose";

const programacaoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    faixa: { type: mongoose.Schema.Types.ObjectId, ref: 'faixa', required: true },
    defesa: { type: [mongoose.Schema.Types.ObjectId], ref: 'defesa' },
    ataquesDeMao: { type: [mongoose.Schema.Types.ObjectId], ref: 'ataque_de_mao' },
    chutes: { type: [mongoose.Schema.Types.ObjectId], ref: 'chute' },
    defesaPessoal: { type: [mongoose.Schema.Types.ObjectId], ref: 'defesa_pessoal' },
    sequenciaDeCombate: { type: [mongoose.Schema.Types.ObjectId], ref: 'sequencia_de_combate' },
    katas: { type: [mongoose.Schema.Types.ObjectId], ref: 'kata' },

}, { versionKey: false });

const programacao = mongoose.model("programacao", programacaoSchema);

export default programacao;