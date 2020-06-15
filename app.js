'use strict'

//cargar módulos de node para crear servidor
var express = require('express');
var bodyParser = require('body-parser');

// ejecutar express (http)
var app = express();

// cargar archivos de rutas
var article_routes = require('./routes/article');

// middlewares
app.use(bodyParser.urlencoded({extended:false})); //utilizar el bodyParser
app.use(bodyParser.json()); //convertir las peticioens que lleguen a JSON

// CORS: acceso cruzado entre dominios para que se puedan hacer llamadas desde otro frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// prefijos para rutas / cargar rutas
app.use('/api', article_routes); //se agrega el /api para que las llamadas tengan que hacerse a /api/ruta

//  exportar el modulo
module.exports = app;