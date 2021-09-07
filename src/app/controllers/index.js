const fs = require('fs')
const path = require('path')

module.exports = app => {
    fs
        .readdirSync(__dirname) // ler ess arquivo e 
        // filtrar os que não começam com ponto ou index.js
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
        .forEach(file => require(path.resolve(__dirname, file))(app))
}