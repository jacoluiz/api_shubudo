import mongoose from "mongoose";
import { movimentoPadraoSchema } from "./movimentoPadraoModel.js";

const kataSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    faixa: { type: String, require: true },
    ordem: { type: Number, },
    quantidadeMovimentos: { type: Number, },
    movimentos: [movimentoPadraoSchema],
    video:{ type: String, },
    temposVideo:[Number] 

}, { versionKey: false });

const kata = mongoose.model("katas", kataSchema);

export default kata;