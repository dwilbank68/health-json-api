var {User} = require('./../models/user');

var authenticate = (req,res,next) => {
    console.log('------------------------------------------');
    console.log('req.header(x-auth)', req.header('x-auth'));
    console.log('------------------------------------------');
    var token = req.header('x-auth');

    User.findByToken(token)
        .then((user) => {
            if (!user) { return Promise.reject() };      // which triggers catch block
            req.user = user;
            req.token = token;
            next();
        })
        .catch((e) => {
            res.status(401).send();
        })
}

module.exports = {authenticate};