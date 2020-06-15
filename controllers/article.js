'use strict'

const { default: validator } = require("validator");
// es lo mismo que
// var validator = require('validator')
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');

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
    },
    upload: (req,res) => {
        // configurar el modulo connect multiparty en routes/article.js

        // tomar el archivo de la petición post
        var file_name = "imagen no subida";

        if(!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        // tomar nombre y extensión
        var file_path = req.files.file0.path;
        var file_split = file_path.split("\\");
        //var file_split = file_path.split("//"); //si el server fuera en Linux o Mac

        // extraer nombre
        var file_name = file_split[2];

        //extraer extensión
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // validar extensión, solo imágenes, sino borrar archivo
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            // borrar el archivo si no es válida la extensión
            fs.unlink(file_path, (err)=>{
                return res.status(200).send({
                    status: 'error',
                    message: "la extensión de la imagen no es válida"
                });
            });
        } else {
            // si todo es válido
            var articleId = req.params.id;
            // buscar el articulo, asignarle el nombre de la imagen y actualizarla
            Article.findOneAndUpdate(
                {_id: articleId}, 
                {image: file_name}, 
                {new: true}, 
                (err, articleUpdated) => {
                    if(err || !articleUpdated){
                        return res.status(200).send({
                            status: 'error',
                            message: "Error al guardar la imagen del artículo"
                        });
                    }
                    
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                }
            );
        }        
    },
    getImage: (req,res) => {
        var file = req.params.image;
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if(exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: "La imagen no existe"
                });
            }
        });
    }
};

module.exports = controller;