import mongoose from "mongoose";
import { movimentoPadraoSchema } from "./movimentoPadraoModel.js";

const kataSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    faixa: { type: String, require: true },
    ordem: { type: Number, },
    quantidadeMovimentos: { type: Number, },
    movimentos: [movimentoPadraoSchema],
    video: [
        {
            orientacao: { type: String, enum: ['frente', 'esquerda', 'direita', 'costas'], required: true },
            url: { type: String, required: true }
        }
    ],
    temposVideos: [
        {
            descricao: { type: String, enum: ['frente', 'esquerda', 'direita', 'costas'], required: true },
            tempo: { type: [Number], required: true }
        }
    ]

}, { versionKey: false });

const kata = mongoose.model("katas", kataSchema);

export default kata;