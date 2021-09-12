const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authconfig = require('../../config/auth.json')
const router = express.Router();
const crypto = require('crypto')
// const mailer = require('../../modules/mailer')
const nodemailer = require('nodemailer')
const {host, port, useremail, password,} = require('../../config/mail.json')


function generateToken(params = {}){
    return jwt.sign({params}, authconfig.secret, {
        expiresIn: 86400 // um dia
    })
}

router.post('/register', async (req, res) => {
    const {email} = req.body
    try{
        if(await User.findOne({ email }))
        return res.status(400).send({ error: "User already exists"});

        const user = await User.create(req.body);
        user.password = undefined

        res.send({
            user, 
            token: generateToken({ id: user.id})
        });

    }catch(e){
        console.log(e)
        return res.send(e);
    }
})

router.post('/authenticate', async(req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({ error: 'User not found!'});
    
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password!'});

    user.password = undefined

    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken({ id: user.id})
    })

})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(400).send({ error: 'User not found!' });
        
        const token = crypto.randomBytes(20).toString('hex')
        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        })
        const transport = nodemailer.createTransport({
            host,
            port,
            auth: {
                user: useremail,
                pass: password
            }
        });

        transport.sendMail({
            from:"novo contato <larissa.c.hirata@gmail.com>",
            to: email,
            context: { token },
            subject:"token para reset de senha ",
            text: "Use o seguinte token: ",
            html:"<h1>Reset de senha:"+ token +" </h1>"
            }).then(message =>{
                res.status(200).send("mensagem enviada com sucesso")
            }).catch(err => {
                console.log(err)
                res.status(400).send(err)
        })  

    } catch (err) {
        res.status(400).send({ error: "Error on forgot password. Try again"})
    }
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body
    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires')
        
        if (!user)
            return res.status(400).send({ error: 'User not found!' });
        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Invalid token!' });
        
        const now = new Date()

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired. Generete a new one.' });
        
        user.password = password;

        await user.save()

        res.send()
        
        
    }catch (err) {
        res.status(400).send({ error: "Error on reset password. Try again"})
    }
    
})

router.get('/image_profile/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    res.type(user.img.contentType).send(user.img.data);
})

module.exports = app => app.use('/auth', router);