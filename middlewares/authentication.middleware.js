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
            res.status(403).json(ApiResponse.error(
                403, 'Error authenticating token', [err.message]
            ))
            res.end();
            return;
        };
        req.user = user;

        next();
    });
};

module.exports.authenticateToken = authenticateToken;