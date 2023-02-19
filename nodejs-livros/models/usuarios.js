const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  livros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livro' }]
});


module.exports = mongoose.model('Usuario', UsuarioSchema);