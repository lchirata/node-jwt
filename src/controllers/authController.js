const express = require('express');
const User = require('../models/User')

const router = express.Router();

router.post('/register', async (req, res) => {
    try{
        const user = await User.create(req.body);
        return res.send({ user });

    }catch(e){
        console.log(e)
        return res.send(e);
    }
})

module.exports = app => app.use('/auth', router);