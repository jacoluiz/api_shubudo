import mongoose from "mongoose";
import { movimentoPadraoSchema } from "./movimentoPadraoModel.js";

const armamentoSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    arma: { type: String, required: true }, // Campo adicional para o armamento
    faixa: { type: String, required: true },
    numeroOrdem: { type: Number, required: true },
    movimentos: [movimentoPadraoSchema],
    video: { type: String }
}, { versionKey: false });

const armamento = mongoose.model("armamentos", armamentoSchema);
const defesasDeArmas = mongoose.model("defesas_de_armas", armamentoSchema);

export {
    armamento,
    defesasDeArmas
};
