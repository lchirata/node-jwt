const express = require('express');
const bodyParser = require('body-parser');
const nodemon = require('nodemon')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

app.get('/', (req, res) =>{
    res.send("tudo okay")
})

require('./controllers/authController')(app);

app.listen(3000);

