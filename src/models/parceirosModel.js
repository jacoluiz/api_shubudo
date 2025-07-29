import mongoose from "mongoose";

const parceiroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  localizacao: { type: String }, // opcional
  telefone: { type: String, required: true },
  site: { type: String }, // opcional
  logomarca: { type: String, required: true }, // URL da logomarca
  imagens: { type: [String], default: [] } // lista de URLs das imagens
}, { versionKey: false });

const Parceiro = mongoose.model("parceiros", parceiroSchema);

export default Parceiro;
