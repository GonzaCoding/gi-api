'use strict'

var mongoose = require('mongoose');
var app = require ('./app');
var port = 4302;

// agregar los deprecation warnings para que no tire Warnings
// https://mongoosejs.com/docs/deprecations.html
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/api_rest_prueba')
        .then(()=>{
            console.log("[DB] Conexión exitosa!!!");

            //crear servidor y ponerme a escuchar peticiones http
            app.listen(port, ()=>{
                console.log("[DB] Servidor corriendo en http://localhost:"+port);
            });
        });

