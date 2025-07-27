import mongoose from "mongoose";

const galeriaFotoSchema = new mongoose.Schema({
    eventoId: { type: mongoose.Schema.Types.ObjectId, ref: "galeria_eventos", required: true },
    url: { type: String, required: true }, // URL da imagem no S3
    nomeArquivo: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios", required: true },
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

const GaleriaFoto = mongoose.model("galeria_fotos", galeriaFotoSchema);

export default GaleriaFoto;
