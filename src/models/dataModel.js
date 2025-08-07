import mongoose from "mongoose";

const dateSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date },
  criadoPor: { type: String },
  local: { type: String },
  confirmados: { type: [String], default: [] },
  academia: { type: String },
  eventoOficial: { type: Boolean, default: false },
  presencas: {
    type: [{
      email: { type: String, required: true },
      confirmadoProfessor: { type: Boolean, default: false },
      academia: { type: String, required: true }
    }],
    default: []
  }

}, { versionKey: false });

const DateEvent = mongoose.model("dates", dateSchema);

export default DateEvent;
