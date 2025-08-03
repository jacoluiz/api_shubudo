import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    peso: { type: String },
    altura: { type: String },
    idade: { type: String },
    perfil: { type: String, default: "básico" },
    perfis: { type: [String], default: ["aluno"] },
    corFaixa: { type: String },
    status: { type: String, default: "ativo" },
    dan: { type: Number, default: 0 },
    academia: { type: String },
    tamanhoFaixa: { type: String },
    lesaoOuLaudosMedicos: { type: String },
    registroAKSD: { type: String },
    fcmToken: { type: String },
    professorEm: { type: [String], default: [] }
}, { versionKey: false });

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
