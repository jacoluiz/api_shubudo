import mongoose from "mongoose";

const ataquesDeMaoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    faixaCorespondente: { type: String, require: true },
    base: { type: String },
    nome: { type: String },
    observacao: { type: String },

}, {versionKey: false});

const ataquesDeMao = mongoose.model("ataquesDeMao", ataquesDeMaoSchema);

export default ataquesDeMao;