const mongoose = require('../database/index')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false //com essa notação, quando realizar query, não irá trazer esse campo
    },
    createdAd:{
        type: Date, 
        default: Date.now,
    },
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10) //encriptando senha antes de salvar - 10 é a qntd de round 
    this.password = hash

    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;