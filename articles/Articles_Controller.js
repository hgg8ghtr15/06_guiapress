const express = require("express")
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")

router.get('/article/index', (request, response) => {
  Article.findAll(
    {include:[{model: Category}]} //faz o join na tabela para exibir na views
  ).then(Articles =>{
    response.render("admin/articles/index", { Articles : Articles })
  })
})

router.get("/article/new", (request, response) => {
  Category.findAll().then((categorias) => {
    response.render("admin/articles/new", { categorias : categorias })
  })
})


router.post("/article/save", (request, response) => {
  const {title, body, category} = request.body
  const slug = slugify(title)

  Article.create({
    title: title,
    slug: slug,
    body: body,
    CategoryId: category
  })
  response.send("Criada com sucesso.")
})

router.post("/article/deletar", (request, response) => {
  const {id} = request.body

  if(id != undefined){
    if(!isNaN(id)){
      Article.destroy({
        where: { id: id}
      }).then(()=>{
        return response.redirect("/article/index")
      })
    }else{
      return response.redirect("/article/index")
    }
  }else{
    return response.redirect("/article/index")
  }

})

module.exports = router