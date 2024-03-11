import mongoose from "mongoose";

const movimentoPadraoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    tipo: { type: String, require: true },
    faixaCorespondente: { type: String, require: true },
    base: { type: String, require: true },
    nome: { type: String, require: true },
    observacao: { type: String },

}, { versionKey: false });

const movimentoPadrao = mongoose.model("movimentoPadrao", movimentoPadraoSchema);

export default movimentoPadrao;