'use strict'

const { default: validator } = require("validator");
// es lo mismo que
// var validator = require('validator')
var Article = require('../models/article');

var controller = {
    datosCurso: (req,res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: "Master",
            autor: "GI",
            url: "gi.com",
            ano: 2020,
            hola
        });
    },
    test: (req,res) => {
        return res.status(200).send({
            message: "Acción de prueba"
        });
    },
    save: (req,res) => {
        // tomar parámetros del post
        var params = req.body;


        // validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch(err) {
            return res.status(200).send({
                status: 'error',
                message: "Falta enviar" + (!validate_title ? " titulo": " contenido")
            });
        }
        if(validate_content && validate_title){
            // crear objeto a guardar
            var article = new Article();

            // asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;


            // guardar en articulo
            article.save((err, articleStored)=>{
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: "El artículo no se ha guardado"
                    });
                }

                // devolver la respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            })
        } else {
            return res.status(200).send({
                status: 'error',
                message: "Los datos no son válidos"
            });
        }  
    },
    getArticles: (req,res) => {

        var query = Article.find({});
        var last = req.params.last;

        if(last || last != undefined){
            query.limit(5)
        }

       query.sort('-data').exec((err, articles)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: "No se pueden obtener los artículos"
                });
            } 

            if(Array.isArray(articles) && articles.length){
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: "No hay artículos"
                });
            }
            
        });
        
    },
    getArticle: (req,res) => {
        //recoger el id de la url
        var articleId = req.params.id;

        // comprobar que existe parámetro
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: "No hay parámetro de búsqueda"
            });
        }

        // buscar el articulo
        Article.findById(articleId, (err,article)=>{
            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: "No existe artículo"
                });
            }

             // devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },
    update: (req,res) => {
        
        //recoger el id de la url
        var articleId = req.params.id;

        // recoger datos del put
        var params = req.body;

        // validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch(err) {
            return res.status(200).send({
                status: 'error',
                message: "Falta enviar" + (!validate_title ? " titulo": " contenido")
            });
        }


        
        if(validate_content && validate_title){
            

            // crear objeto a guardar
            var articleToUpdate = new Article();

            // asignar valores
            articleToUpdate._id = articleId;
            articleToUpdate.title = params.title;
            articleToUpdate.content = params.content;
            articleToUpdate.image = null;


            // find y update
            Article.findByIdAndUpdate(
                {_id: articleToUpdate._id},
                articleToUpdate,
                {new: true},
                (err, articleUpdated) => {
                    if(err || !articleUpdated){
                        return res.status(500).send({
                            status: 'error',
                            message: "Error al actualizar"
                        });
                    }
                    // devolver la respuesta
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                }
            );
        } else {
            return res.status(200).send({
                status: 'error',
                message: "Los datos no son válidos"
            });
        } 
    },
    delete: (req,res) => {

        // tomar id de la url
        var articleId = req.params.id;

        // find and delete

        Article.findOneAndDelete(
            {_id: articleId},
            (err, articleRemoved) => {
                if(err ){
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al borrar"
                    });
                }
                if(!articleRemoved){
                    return res.status(404).send({
                        status: 'error',
                        message: "Error al borrar, posiblemente no exista"
                    });
                }
                // devolver la respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleRemoved
                });
            }
        );
    }
};

module.exports = controller;