const express = require("express")
const router = express.Router()
const Usuario  = require('./user')
const bcrypt = require('bcryptjs')

router.get("/admin/usuarios",(request, response) => {
  Usuario.findAll().then(Usuarios =>{
    return response.render('admin/usuarios/index', { Usuarios :Usuarios })
  })
})


router.get("/admin/usuario/create", (request, response)=>{
  return response.render('admin/usuarios/new')
})


router.post("/admin/usuario/save", (request, response)=>{
  const {email, senha, senha2} = request.body



  if ( email === undefined ){
    const msg_erro = "O campo E-mail não pode ser vazio."
    return response.render("admin/usuarios/new",{ msg_erro: msg_erro } )
  }else{
    if( senha.length < 8 ){
      const msg_erro = "O campo senha deve ter no minimo 8 caracteres!"
      return response.render("admin/usuarios/new",{ msg_erro: msg_erro, email: email } )
    }else if(senha === senha2){

      Usuario.findOne({
        where:{email:email}
      }).then( usuario =>{

        if(usuario === null){
          console.log("Cadastrar")

          const salt = bcrypt.genSaltSync(10)
          const hash  = bcrypt.hashSync(senha, salt)
          console.log(hash)

          Usuario.create({
            email:email,
            senha:hash
          })
          const msg_sucesso = "Usuario criado com sucesso!"
          return response.render("admin/usuarios/new",{msg_sucesso: msg_sucesso} )

        }else{
          console.log("Existente!")
          const msg_erro = "Este usuário já existe!"
          return response.render("admin/usuarios/new",{msg_erro: msg_erro, email} )
        }
      })
    }else{
      const msg_erro = "As senha não conferem!"
      return response.render("admin/usuarios/new",{msg_erro: msg_erro, email} )
    }
  }
})


router.get("/admin/usuario/edit/:id", (request, response )=>{
  const {id} = request.params
  if (isNaN(id)){
    return response.redirect("/admin/usuarios")
  }else{
    Usuario.findByPk(id).then( Usuario =>{
      return response.render('admin/usuarios/edit', {Usuario:Usuario})
    })
  }
})


router.post("/admin/usuario/update", (request, response)=>{
  const {id,email} = request.body
  console.log(email, id)

  Usuario.findOne({
    where: {email: email}
  }).then( usuario => {
    if(usuario === null){
      console.log("nulo")
      Usuario.update(
        {email:email},
        {where: {id: id}}
      )
      return response.redirect("/admin/usuario/edit/"+id)
    }else{
      console.log("Existente")
      return response.redirect("/admin/usuario/edit/"+id)
    }
  })
})


router.post("/admin/usuario/deletar", (request, response) => {
  const {id} = request.body
  console.log(id)
  if(id != undefined){
    if (!isNaN(id)){
      Usuario.destroy({
        where: {id: id}
      }).then(() => {
        return response.redirect("/admin/usuarios")
      })
    }else{
      return response.redirect("/admin/usuarios")
    }
  }else{
    return response.redirect("/admin/usuarios")
  }
})

router.get("/login", (request, response) => {
  response.render("admin/usuarios/login")
})

router.post("/autenticacao", (request, response) => {
  const {email, senha} = request.body
  console.log(email, senha)

  Usuario.findOne({
    where: {email: email}
  }).then((usuario) => {
    if(usuario != undefined){ //se existit

      const compare = bcrypt.compareSync(senha, usuario.senha)
      if (compare){
        request.session.user = {
          id: usuario.id,
          email: usuario.email
        }
        return response.redirect("/")
      }else{
        msg_erro = "Senha incorreta"
        response.render("admin/usuarios/login", {msg_erro: msg_erro} )
      }
    }else{ // se não existir
      msg_erro = "E-mail não cadastrado"
      response.render("admin/usuarios/login", {msg_erro: msg_erro} )
    }
  })
})

router.get("/logout", (request, response) => {
  request.session.user = undefined

  const msg_sucesso = "Usuário deslogado com sucesso!"
  response.render("admin/usuarios/login", {msg_sucesso: msg_sucesso} )
})


module.exports = router
