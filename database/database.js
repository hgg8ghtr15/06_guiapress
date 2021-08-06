const Sequelize = require('sequelize')

const connection = new Sequelize("guiapress", "root", "J6t2hybt26@",{
  host: "localhost",
  dialect: "mysql",
  timezone:"-03:00"
})

module.exports = connection