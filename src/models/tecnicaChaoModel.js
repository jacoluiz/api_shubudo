import mongoose from "mongoose";

const tecnicaChaoSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId },
        nome: { type: String, required: true },
        descricao: { type: String, required: true },
        ordem: { type: Number, required: true },
        observacao: { type: [String], default: [] },
        faixa: { type: String, required: true },
        video: { type: String }
    },
    { versionKey: false }
);

const TecnicaChao = mongoose.model("tecnicas_chao", tecnicaChaoSchema);

export default TecnicaChao;
