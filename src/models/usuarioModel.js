import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Nome de usuário único
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    peso: { type: String },
    altura: { type: String },
    corFaixa: { type: String }
}, { versionKey: false });

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
