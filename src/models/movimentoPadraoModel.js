import mongoose from "mongoose";

const movimentoPadraoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    faixaCorespondente: { type: String, require: true },
    base: { type: String, require: true },
    nome: { type: String, require: true },
    observacao: { type: [String] },

}, { versionKey: false });

const chute = mongoose.model('chute', movimentoPadraoSchema);
const ataqueMao = mongoose.model('ataque_de_mao', movimentoPadraoSchema);
const defesa = mongoose.model('defesa', movimentoPadraoSchema);

export {
    chute,
    ataqueMao,
    defesa
};