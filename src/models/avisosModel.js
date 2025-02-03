import mongoose from "mongoose";

const avisoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    imagem: { type: String }, // URL ou caminho da imagem
    arquivos: [{ type: String }], // Array de strings, onde cada string representa um arquivo
    ativo: { type: Boolean, default: true }, // Indica se o aviso está ativo
    dataCriacao: { type: String, default: () => new Date().toISOString() }, // Data de criação em formato string
    exclusivoParaFaixas: [{ type: String }] // Array que define as faixas exclusivas para as quais o aviso se aplica
}, { versionKey: false });

const Aviso = mongoose.model("Aviso", avisoSchema);

export default Aviso;
