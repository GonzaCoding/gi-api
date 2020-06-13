'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

// rutas de prueba
router.post('/datos', ArticleController.datosCurso);
router.get('/test', ArticleController.test);

// rutas utiles de artículos
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);

module.exports = router;
