require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const app = express()
const mongoose = require('mongoose')

/* require('./database/db') */
const path = require('path');
const router = require("./routes/usuarios")

mongoose.set("strictQuery", true);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node--aprendizado', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Conectado ao MongoDB")
}).catch((err) => {
    console.log("Erro ao se conectar ao MongoDB: " + err)
})

/* const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost/node--aprendizado';
const dbName = 'node--aprendizado';
/* require('../models/usuarios');
require('dotenv').config();

MongoClient.connect(url, (err, client) => {
    if (err) {
       console.error('Erro ao conectar com o MongoDB:', err);
       return;
    }
 
    const db = client.db(dbName);
 
    db.collection('livros').find().forEach((livro) => {
       db.collection('usuarios').updateOne(
          {_id: livro.usuario_id},
          {$addToSet: {livros: {titulo: livro.titulo, autor: livro.autor, qtd_paginas: livro.qtd_paginas, editora: livro.editora, image: livro.image}}},
          (err, result) => {
             if (err) {
                console.error('Erro ao atualizar o usuário:', err);
             } else {
                console.log(`Usuário ${livro.usuario_id} atualizado com sucesso.`);
             }
          }
       );
    });
}) */

// Configuração do body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//PUBLIC
app.engine('handlebars', handlebars.engine({
runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
}}))

app.set('view engine', 'handlebars')

app.use('/', express.static('public'))
app.use('/usuarios/', express.static('public'))
app.use('/admin/', express.static('public'))

app.use('/admin/minha-estante/uploads', express.static(path.resolve('uploads')));
app.use('/admin/minha-estante/', express.static(path.resolve('uploads')))

// Rotas

app.use('/', router)
app.use('/usuarios', router)


const PORT = process.env.PORT || 3000
    
app.listen(PORT, (req, res) => {
    console.log(`Server is running in http://localhost:${PORT}`)
})