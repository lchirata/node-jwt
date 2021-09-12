const mongoose = require('../../database/index')
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
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAd:{
        type: Date, 
        default: Date.now,
    },
    img:{
        data: Buffer,
        contentType: String
    }
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10) //encriptando senha antes de salvar - 10 é a qntd de round 
    this.password = hash

    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;