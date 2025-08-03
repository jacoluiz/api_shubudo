import mongoose from "mongoose";

// Subdocumento de Filial
const filialSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    endereco: { type: String, required: true },
    descricao: { type: String },
    imagens: { type: [String], default: [] } // lista opcional de strings (URLs, por exemplo)
});

// Schema principal de Academia
const academiaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String },
    professores: {type: [String],default: []},
    filiais: {
        type: [filialSchema],
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length > 0;
            },
            message: "A academia deve conter pelo menos uma filial."
        }
    }
}, { versionKey: false });

const Academia = mongoose.model("academias", academiaSchema);

export default Academia;
