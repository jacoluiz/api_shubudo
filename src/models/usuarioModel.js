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
    academiaId: { type: String },
    filialId: { type: String },
    tamanhoFaixa: { type: String },
    lesaoOuLaudosMedicos: { type: String },
    registroAKSD: { type: String },
    fcmToken: { type: String },
    professorEm: { type: [String], default: [] },
    notas: {
        type: [{
            nomeEvento: { type: String },
            dataEvento: { type: String },
            faixaAvaliada: { type: String },
            avaliador: { type: String },
            ataquesDeMao: { type: String },
            defesas: { type: String },
            chutes: { type: String },
            defesaPessoal: { type: String },
            sequenciaDeCombate: { type: String },
            katas: { type: String },
            defesaExtraBanner: { type: String },
            sequenciaDeAmarela: { type: String },
            rolamentosEQuedas: { type: String },
            projecoes: { type: String },
            armas: { type: String },
            defesaDeArma: { type: String },
            saidaDeEstrangulamento: { type: String },
            tecnicasDeChao: { type: String },
            aprovado: { type: Boolean },
        }],
        default: []
    }
}, { versionKey: false });

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
