const express = require('express')
const router = express.Router()
const Category = require('./Category')
const slugify = require('slugify')

router.get('/admin/category/new', (request, response) => {
  return response.render("admin/categories/new")
})

router.get("/admin/category", (request, response) => {
  Category.findAll().then(Categorias => {
    return response.render("admin/categories", {Categorias:Categorias})
  })
})

router.post('/category/new', (request, response) => {
  const {title} = request.body
  if (title) {
    // console.log(slugify(title))
    Category.create({
      title: title,
      slug: slugify(title)
    }).then(()=>{
      return response.redirect("/admin/category/new")
    })
  }else {
    console.log("Inexistente")
    return response.redirect("/admin/category/new")
  }
})


router.post("/category/delete", (request, response) => {
  const {id} = request.body
  if (id){
    if (!isNaN(id)){
      Category.destroy({
        where: {id: id},
      }).then(()=>{
        return response.redirect("/admin/category")
      })
    }else{
      console.log("Não é numero")
      return response.redirect("/admin/category")
    }
    console.log(id)
  }else{
    console.log("Inexistente")
    return response.redirect("/admin/category")
  }
  return response.redirect("/admin/category")
})


router.get("/admin/category/editar/:id", (request, response) => {
  const {id} =  request.params
  console.log(id)
  Category.findByPk(id).then(categoria => {
    if(categoria){
      return response.render("admin/categories/edit", {categoria: categoria})
    }else{
      return response.redirect("/admin/category")
    }
  }).catch(error =>{
    return response.redirect("/admin/category")
  })
})


router.post("/category/update", (request, response) => {
  const {id, title} =  request.body
  console.log(id, title)

  Category.update({title: title, slug:slugify(title)},
    {where:
      {
        id:id
      }
    }
  ).then( ()=>{
    return response.redirect("/admin/category")
  })
})

// router.get("/categories/new", (request, response)=>{
//   response.send("ROTA PARA CRIAR UMA NOVA CATEGORIA")
// })

module.exports = router