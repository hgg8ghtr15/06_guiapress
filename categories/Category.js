const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = connection.define('Categories', {
  title:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug:{
    type: Sequelize.TEXT,
    allowNull: false,
  }
})

/*
* Usado apenas uma vez
* */
// Category.sync({force: true})

module.exports = Category;