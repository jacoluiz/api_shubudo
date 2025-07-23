import mongoose from "mongoose";

const avisoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  conteudo: { type: String, required: true },
  dataHoraCriacao: { type: Date, default: Date.now }, // define data/hora de criação automaticamente
  publicoAlvo: { type: [String], default: [] }
}, { versionKey: false });

const Aviso = mongoose.model("avisos", avisoSchema);

export default Aviso;
