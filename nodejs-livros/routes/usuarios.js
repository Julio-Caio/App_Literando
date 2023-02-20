const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

require('../models/usuarios')
require('../models/livros');
/* const livrosControllers = require('../controllers/livrosController'); */
const upload = require('../config/multer');

require('../config/multer');
const Usuarios = mongoose.model('Usuario');
const Livros = mongoose.model('Livro')
const bcrypt = require('bcryptjs');

//Rotas de cadastro de usuários e acesso a Home Page

router.get('/', (req, res) =>{
    res.render('/public/index')
})

router.get('/usuarios/cadastro', (req, res) =>{
    res.sendFile(process.cwd() + '/public/cadastro.html')
})


router.post('/usuarios/cadastro', async (req, res) => {
    const { email, senha, senha2} = req.body
    
    //validação dos campos
    
    if(email == "") {
        console.log("E-mail não preenchido")
      }
    if(!senha) {
        console.log("Senha não preenchida")
    }
    if(!senha2) {
        console.log("Confirmação de senha não preenchida")
    }
    
    if(senha != senha2) {
        console.log("As senhas não são iguais")
    }

    const usuarioExiste = await Usuarios.findOne({email: req.body.email})
    
    if(usuarioExiste) {
        return res.status(422).json({message: "Já existe uma conta com esse e-mail no nosso sistema"})
    }

/*     else { */
    
        //Criptografia da senha

        const salt = bcrypt.genSaltSync(10)

        const hash = bcrypt.hashSync(senha, salt)

        const novoUsuario = new Usuarios({email: req.body.email, senha: hash})

        try {
            await novoUsuario.save()
          
            res.status(201).send('<style> h1{ font-family: Arial} </style> <h1>Usuário cadastrado com sucesso! <h1>')

        } catch (error) {
            res.status(500).json({message: "Deu ruim"})
        }
/*     } */
      })
  
router.use(cookieParser())
    
router.get('/usuarios/login', (req, res) => {
      res.sendFile(process.cwd() + '/public/signin.html')
  })

router.post('/usuarios/login', (req, res, next) => {
  Usuarios.findOne({ email: req.body.email/* , senha: req.body.senha */}, function (err, user) {

    if (err) return res.status(500).json({ msg: 'Erro no servidor.'});

    if (!user) return res.status(404).send('<style> h1{ font-family: Arial} </style> <h1>Usuário não encontrado.<h1>');
    
    const passwordIsValid = bcrypt.compareSync(req.body.senha, user.senha);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null }) ;
    
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: 86400 // expira em 24 horas
    });
    
    res.cookie('auth', token)

    return res.redirect('/admin/minha-estante');
  });
  
})

router.get('/admin/minha-estante', async (req, res) => {
  try {
    // Verifica o token de autenticação do usuário
    const token = req.cookies.auth;
    const decoded = jwt.verify(token, process.env.SECRET);

    // Busca os livros cadastrados pelo usuário em ordem do mais recente ao mais antigo
    const usuario = await Usuarios.findById(decoded.id).populate('livros');

    // Retorna os livros do usuário
    res.render('admin/post', {livros: usuario.livros});
  } catch (err) {
    res.redirect('/usuarios/login');
  }
});

router.post('/admin/minha-estante', upload.single('image'), async (req, res) => {
  try {
    const token = req.cookies.auth;
    const decoded = jwt.verify(token, process.env.SECRET);
    
    const usuario = await Usuarios.findById(decoded.id);
    
    const livro = new Livros({
      titulo: req.body.titulo,
      image: req.file.path,
      autor: req.body.autor,
      qtd_paginas: req.body.qtd_paginas,
      editora: req.body.editora,
      usuario_id: decoded.id
    });
    
    const response = await livro.save(); // Adicionado o "await" para esperar o salvamento do livro
    
    usuario.livros.push(livro);
    await usuario.save();
    
    res.redirect('/admin/minha-estante');

  } catch (err) {
    res.status(401).json({
      mensagem: 'Erro no cadastro do livro: ' + err.message // Retornando a mensagem de erro corretamente
    });
  }
});


router.put('/admin/minha-estante/:id', async(req, res)=> {
  res.send({msg: "Editado com sucesso"})
})


router.get('/admin/deletar/:id', async (req, res) => {
  try {
    // Verifica o token de autenticação do usuário
    const token = req.cookies.auth;
    const decoded = jwt.verify(token, process.env.SECRET);

    // Busca o usuário e verifica se ele é o dono do livro
    const usuario = await Usuarios.findById(decoded.id).populate('livros');
    const livro = await Livros.findById(req.params.id);

    if (livro.usuario_id.toString() !== usuario._id.toString()) {
      return res.status(401).json({ mensagem: 'Usuário não autorizado' });
    }

    // Deleta o livro e remove a referência no usuário
    await Livros.findByIdAndDelete(req.params.id);
    usuario.livros = usuario.livros.filter((id) => id.toString() !== req.params.id);
    await usuario.save();

    // Retorna mensagem de sucesso
    res.status(200).json('<style> h1{ font-family: Arial} </style> <h1> Livro deletado com sucesso! <h1>');
  } catch (err) {
    res.status(401).json({ mensagem: 'Erro ao deletar o livro: ' + err.message });
  }
});

router.get('/admin/logout', (req, res) => {
  res.clearCookie('auth')
  res.sendFile(process.cwd() + '/public/signin.html')
})
module.exports = router
