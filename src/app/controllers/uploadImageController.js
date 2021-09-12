const express = require('express')
const authMiddleware = require('../middlewares/auth')
const router = express.Router();
const User = require('../models/User');

const multer = require('multer');
const fs = require('fs');


router.use(authMiddleware);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
const upload = multer({ storage: storage });

router.post('/upload_image', upload.single('img'), async (req, res, next) => {
    const id = req.userId
    let 
        img = {
            data: fs.readFileSync('uploads/' + req.file.filename),
            contentType: 'image/png'
        }
    
    try {
        await User.findByIdAndUpdate(id, { '$set': { img: img }})
        res.type(img.contentType).send(img.data);
    } catch (e) {
        res.status(400).send({ error: "Error on upload image"})
    }

});


module.exports = app => app.use('/', router)