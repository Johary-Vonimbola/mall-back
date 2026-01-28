const ApiResponse = require('../utils/ApiResponse');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(500).json(ApiResponse.error(
            500, 'Error performing the request', ['No header found']
        ));
    }
    const token = authHeader.split(' ')[1];
    if(!token) return res.status(500).json(ApiResponse.error(
        500, 'Error performing the request', ['No token provided']
    ));

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            res.status(403, 'Access denied', [err.message])
            res.end();
            return;
        };
        req.user = user;

        console.log(user);
        next();
    });
};

module.exports.authenticateToken = authenticateToken;