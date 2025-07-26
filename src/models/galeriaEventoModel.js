import mongoose from "mongoose";

const galeriaEventoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String },
    data: { type: Date, required: true },
    academiaId: { type: mongoose.Schema.Types.ObjectId, ref: "academias", required: true },
    filialId: { type: mongoose.Schema.Types.ObjectId, required: true },
    criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios", required: true },
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

const GaleriaEvento = mongoose.model("galeria_eventos", galeriaEventoSchema);

export default GaleriaEvento;
