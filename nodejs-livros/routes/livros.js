const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Livros = mongoose.model('livros')
const multer = require('multer')

const livrosControllers = require('../controllers/livrosController');
const upload = require('../config/multer');

require('../config/multer');
require('../models/livros');

router.get('/admin/minha-estante/edit/:id', (req, res) => {
    Livros.findOne({id: req.params.id}).then((livros) => {
        res.render('admin/editlivros', {livros: livros})
    }).catch((err) => {
        console.log("Este livro não existe")
        res.redirect("/admin/minha-estante")
    })})

router.post('/admin/minha-estante/edit', livrosControllers.update)


router.get('/admin/deletar/:id', (req, res) => {
    Livros.deleteOne({id: req.params.id}).then(() => {
        console.log("Livro deletado com sucesso!")
        res.redirect("/admin/minha-estante")
    }).catch((err) => {
        console.log("Houve um erro ao deletar o livro")
        res.redirect("/admin/estante")
    })
})

module.exports = router