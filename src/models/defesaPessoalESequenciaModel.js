import mongoose from "mongoose";
import { movimentoPadraoSchema } from "./movimentoPadraoModel.js";

const defesaPessoalESequenciaSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    faixa: { type: String, required: true },
    numeroOrdem: { type: Number, required: true },
    movimentos: [movimentoPadraoSchema],
    video: { type: String }

}, { versionKey: false });

const defesaPessoal = mongoose.model("defesas_pessoais", defesaPessoalESequenciaSchema);
const sequenciaDeCombate = mongoose.model("sequencias_de_combates", defesaPessoalESequenciaSchema);
const defesaPessoalExtraBanner = mongoose.model("defesas_pessoais_extra_banner", defesaPessoalESequenciaSchema);

export {
    defesaPessoal,
    sequenciaDeCombate,
    defesaPessoalExtraBanner
};
