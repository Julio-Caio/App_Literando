const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Livros = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    titulo: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    qtd_paginas: {
        type: String,
        required: true
    },
    editora: {
        type: String,
        required: true
    },

    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports = mongoose.model('Livro', Livros);

/* const Livros = new mongoose.Schema({

    image: {
        type: String,
        required: true,
    },
    titulo: {
        type: String,
        required: true
    },
        autor: {
            type: String,
            required: true
        },
        qtd_paginas: {
            type: String,
            required: true
        },
        editora: {
            type: String,
            required: true
        },

        /*usuarios:
            {
                type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true}
}
})

module.exports = mongoose.model('livros', Livros) */