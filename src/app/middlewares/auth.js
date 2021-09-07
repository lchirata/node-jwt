const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({ error: 'No token provided'});

    // O token jwt é composto por 2 parte. Bearer + espaço + string alfanumérico.
    // dividir o token com split e verificar se o token começa com bearer (regex) e se tem o alfanumérico em seguida. 

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token error'});

    const [scheme, token] = parts

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token malformatted'});
    
    jwt.verify(token, authConfig.secret, (error, decoded) => {
        if(error) return res.status(401).send({ error: "Token invalid"});

        req.userId = decoded.id;
        return next();
    })

}