const express = require("express")
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")

router.get('/article/index', (request, response) => {
  Article.findAll(
    {include:[{model: Category}]} //faz o join na tabela para exibir na views
  ).then(Artigles =>{
    response.render("admin/articles/index", { Artigles : Artigles })
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

router.get("/article/editar/:id", (request, response) => {
  const {id} = request.params
  console.log(id)
  Article.findByPk(
      id,
      {include:
          [{model: Category}]
      }
    ).then(article => {
    Category.findAll().then(categorias =>{
      return response.render("admin/articles/edit", {article:article, categorias:categorias})
    })
  })
})

router.post("/article/update", (request, response) =>{
  const {id, title, body, category } =  request.body

  Article.update(
      {title:title,slug:slugify(title), body:body, CategoryId:category},
      {where: {id:id}}
  ).then( ()=>{
    return response.redirect("/article/index")
  })
})


router.get("/article/page/:num", (request, response) =>{
  const {num} = request.params
  let offset = 0

  if(num.isNaN || num == 1){
    offset = 0

  }else {
    offset = (parseInt(num) -1 ) * 2
  }

  Article.findAndCountAll(
    {
      limit:2,
      offset:offset,
      include:[{model: Category}]
      }
    ).then(Artigles =>{

      let next;
      if (offset + 2 >= Artigles.count){
        next = false
      }else{
        next = true
      }
      //
      // console.log(Artigles.count)
      // let total_paginas =  parseInt(Artigles.count / 2)
      // let paginas = []
      // for (let i = 0; i < total_paginas; i++){
      //   paginas[i] = i+1
      // }
      // console.log(paginas)

      var resultado = {
        proximo:parseInt(num)+1,
        anterior:parseInt(num)-1,
        num:parseInt(num),
        next:next,
        Artigles:Artigles
      }

      Category.findAll().then(Categorias =>{

      return response.render("admin/articles/page", { resultado:resultado, Categorias:Categorias})
      // return response.json(resultado)
      })
  })

})

module.exports = router

// {include:[{model: Category}]}