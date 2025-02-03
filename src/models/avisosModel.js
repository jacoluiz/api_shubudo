import mongoose from "mongoose";

const avisoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    imagem: { type: String }, // Pode ser a URL ou o caminho da imagem
    arquivos: [{ type: String }] // Array de strings, onde cada string representa um arquivo
}, { versionKey: false });

const Aviso = mongoose.model("Aviso", avisoSchema);

export default Aviso;
