const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')

const categories_Controller = require('./categories/Categories_Controller')
const articles_Controller = require('./articles/Articles_Controller')

const app = express()

const Article = require('./articles/Article')
const Category = require("./categories/Category")

/**
 * view engine
 */
app.set('view engine', 'ejs')

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


app.get("/", (request, response) => {
  return response.render("./index")
})

app.listen(4000, ()=>{console.log("Servidor online")})