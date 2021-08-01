const Sequelize = require('sequelize');
const connection = require('../database/database')
const Category = require('../categories/Category')


const Article = connection.define('Articles', {
  title: {
    type:Sequelize.STRING,
    allowNull: false
  },
  slug :{
    type:Sequelize.STRING,
    allowNull: false
  },
  body:{
    type:Sequelize.TEXT,
    allowNull: false
  }
})

/*
* -> Relacionamento
* */
Category.hasMany(Article) // N para 1
Article.belongsTo(Category) // 1 para 1

/*
* Usado apenas uma vez
* */

// Article.sync({force: true})

module.exports = Article