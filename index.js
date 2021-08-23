const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')
const session = require('express-session')
// const adminautenticacao = require('./middewares/adminautenticacao')

const categories_Controller = require('./categories/Categories_Controller')
const articles_Controller = require('./articles/Articles_Controller')
const usuario_Controller = require("./user/user_Controller")

const app = express()

const Article = require('./articles/Article')
const Category = require("./categories/Category")
const Usuario = require('./user/user')

/**
 * view engine
 */
app.set('view engine', 'ejs')

/**
 *  Session
 *  1 - 1000 max age
 *  Redis
 * */

app.use(session({
  secret:"cadkaçldskncçkdncçakdioidhioar8r9jr9qk]~r´lq]´r-h89ah8asdj8",
  cookie:{maxAge: 60000}
}))


/**
 * Static
 */
app.use(express.static("public"))

/***
 * Body parser
 */
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

/**
 * Database connections
 */
connection
  .authenticate()
  .then(()=>{
    console.log("Conexão feita com sucesso")
  }).catch((error)=>{
    console.log(error)
})

/*
* Rotas de Controller
* */
app.use("/", categories_Controller)
app.use("/", articles_Controller)
app.use("/", usuario_Controller)

app.get("/session", (request, response) =>{
  request.session.treinamento = "Formação node"
  request.session.ano = 2019
  request.session.email = "fabio lucas marconi"
  request.session.user = {
    username:"fabio",
    email:"teste@gmail.com",
    id:3
  }
  return response.send("Sessão Criado")
})

app.get("/leitura", (request, response) =>{
  return response.json({
    user : request.session.user
  })
})

app.get("/", (request, response) => {
  const admin = "admin"
  Article.findAll(
    {
      order:[
        ["id", "DESC"]
      ],
      limit:2
    }
  ).then(Artigles => {
    Category.findAll().then(Categorias => {
      return response.render("./index", {Artigles : Artigles, Categorias : Categorias})
    })
  })
})

app.get("/:slug", (request, response) => {
  const {slug} = request.params
  Article.findOne({
    where:{slug:slug}
  }).then(Artigle => {
    if(Artigle != undefined){
      return response.render("./artigle", { Artigle : Artigle })
    }else{
      return response.redirect("/")
    }
  })
})

app.get("/listar_categoria/:slug", (request, response)=>{
  const {slug} = request.params
  Article.findAll({
    where:{CategoryId:slug}
    }
  ).then(Artigles => {
    Category.findAll().then(Categorias => {
      return response.render("./index", {Artigles : Artigles, Categorias : Categorias})
    })
  })
})



app.listen(4000, ()=>{console.log("Servidor online")})