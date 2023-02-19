const express = require('express');
const { default: mongoose } = require('mongoose');
const multer = require('multer')
require('../models/models')

require('dotenv').config();

mongoose.set("strictQuery", true);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node--aprendizado', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify: false}).then(() => {
    db.collection('livros').find().forEach(function(livro) {
        db.collection('usuarios').update(
           {_id: livro.usuarios_id},
           {$addToSet: {livros: {titulo: livro.titulo, autor: livro.autor, qtd_paginas: livro.qtd_paginas, editora: livro.editora, image: livro.image}}}
        );
     });
    console.log("Conectado ao MongoDB")
}).catch((err) => {
    console.log("Erro ao se conectar ao MongoDB: " + err)
})
