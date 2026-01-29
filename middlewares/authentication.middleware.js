const { ROLE } = require('../data/Role');
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

const authenticateRole = role => {
    return (req, res, next) => {
        let id = undefined;
        if(req.params.id){
            id = req.params.id;
        }
        if(!req.user){
            return res.status(500).json(ApiResponse.error(
                500, 'User unknown', ['No user provided in the request']
            ));
        }
        if(req.user.role !== role && req.user.role !== ROLE.ADMIN){
            return res.status(403).json(ApiResponse.error(
                403, 'Acces denied', ['You don\'t have the access to this ressource']
            )); 
        }
        if(id){
            if(req.user.id !== id && req.user.role !== ROLE.ADMIN){
                return res.status(403).json(ApiResponse.error(
                    403, 'Acces denied', ['You don\'t have the access to this ressource']
                )); 
            }
        }
        next();
    }
}

module.exports.authenticateToken = authenticateToken;
module.exports.authenticateRole = authenticateRole;