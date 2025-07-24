const mongoose = require('mongoose');

const notificacaoSchema = new mongoose.Schema({
  titulo: String,
  conteudo: String,
  dataHora: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notificacao', notificacaoSchema);
