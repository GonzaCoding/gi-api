# Pasos realizados para la creación del proyecto

## Comandos ejecutados durante la instalación

`npm init //para iniciar el proyecto node JS`

## Instalación de dependencias

```
npm install --save express //framework que funciona sobre NODEjs
npm install --save body-parser //para transformar JSON
npm install --save mongoose //ORM de mongoDB
npm install --save connect-multiparty //para poder subir archivos
npm install --save validator //para hacer validaciones
npm install --save-dev nodemon //dependencia solo para desarrollo, hace que actualice a medida que cambiamos el código
```
## Comandos git

`git init //crear repo local`<br />
`git remote add origin https://github.com/[USER]/[REPO].git //vincular con repo en github`<br />
`git add . //marcar archivos para commit inicial`<br />
`git commit -m "Primer commit" //commit inicial`<br />
`git push origin master --force //sin el force tira error de fast-forward`

## Configuraciones

Dentro del package.json se debe agregar el script "start" para poder ejecutar `npm start` y que mediante el `nodemon` se tomen automáticamente los cambios en el código de la aplicación y se recargue:
```
"scripts": {
    "start": "nodemon index.js",
```
Importante no olvidarse la "coma" al final si es que hay otro script (en este caso tengo también "test")