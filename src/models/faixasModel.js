import mongoose from "mongoose";

const faixasSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    faixa: { type: String, require: true },
    orden: { type: Number, },
    dan: { type: Number, }

}, { versionKey: false });

const faixa = mongoose.model("faixas", faixasSchema);

export default faixa;