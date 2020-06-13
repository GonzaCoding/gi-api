'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = Schema({
    title: String,
    content: String,
    data: { type: Date, default: Date.now },
    image: String
});

module.exports = mongoose.model('Article', ArticleSchema);
// en la BD lo pasará al plural y generará la colección "articles", con la estructura definida
