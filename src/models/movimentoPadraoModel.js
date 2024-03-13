import mongoose from "mongoose";

const movimentoPadraoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    faixaCorespondente: { type: String, require: true },
    base: { type: String, require: true },
    nome: { type: String, require: true },
    observacao: { type: [String] },

}, { versionKey: false });

const chute = mongoose.model('chutes', movimentoPadraoSchema);
const ataqueMao = mongoose.model('ataques_de_maos', movimentoPadraoSchema);
const defesa = mongoose.model('defesas', movimentoPadraoSchema);

export {
    chute,
    ataqueMao,
    defesa,
    movimentoPadraoSchema
};