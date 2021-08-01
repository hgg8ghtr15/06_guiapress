const express = require("express")
const router = express.Router()

router.get('/', (request, response) => {
  response.send("Rota de Artigos")
})

router.get("/new", (request, response) => {
  response.send("Rota da Criar um artigo novo.")
})

module.exports = router