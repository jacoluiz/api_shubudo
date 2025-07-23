import mongoose from "mongoose";

const dateSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date }, // opcional, caso queira eventos com duração
  criadoPor: { type: String }, // opcional: ID do usuário ou nome,
  local: { type: String },
  confirmados: { type: [String], default: [] }
}, { versionKey: false });

const DateEvent = mongoose.model("dates", dateSchema);

export default DateEvent;
