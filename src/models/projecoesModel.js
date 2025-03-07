import mongoose from "mongoose";

const projecaoSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId },
        nome: { type: String, required: true },
        nomeJapones: { type: String, required: true },
        descricao: { type: String, required: true },
        observacao: { type: [String], default: [] },
        ordem: { type: Number, required: true },
        faixa: { type: String, required: true },
        video: { type: String }

    },
    { versionKey: false }
);

const Projecao = mongoose.model("projecoes", projecaoSchema);

export default Projecao;
