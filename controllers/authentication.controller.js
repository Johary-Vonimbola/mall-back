const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const RefreshToken = require('../models/Token');

const generateToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
}

const login = async(req, res) => {
    try{
        if(!req.body){
            return res.status(500).json(ApiResponse.error(
                500, 'Error when login', ['Body request not provided']
            ));
        }
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(500).json(ApiResponse.error(
                500, 'Error when login', ['Username or password not provided']
            ));
        }
        const user = await User.findOne({name: username, passwordHash: password});
        if(!user){
            return res.status(500).json(ApiResponse.error(
                500, 'Error when login', ['Wrong information, user not found']
            )); 
        }
        const { name, _id, role } = user;
        const payload = { id: _id, name: name, role: role };
        const accessToken = generateToken(payload);
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
        const tokenObj = new RefreshToken({ refreshToken: refreshToken });
        await tokenObj.save();
        return res.status(200).json(ApiResponse.succes(
            200, 'User logged', {
                accessToken: accessToken,
                refreshToken: refreshToken                
            }
        ));
    }catch(err){
        return res.status(500).json(ApiResponse.error(
            500, 'Error login user', [err.message]
        ));
    }
}

const refreshToken = async(req, res) => {
    if(!req.body){
        return res.status(500).json(ApiResponse.error(
            500, 'Error refreshing the token', ['No body provided in the request']
        ));
    }
    const token = req.body.refreshToken && req.body.refreshToken;
    if(!token){
        return res.status(500).json(ApiResponse.error(
            500, 'Error refreshing the token', ['No refresh token provided in']
        ));
    }
    const tokenInDB = RefreshToken.findOne({refreshToken: token});
    if(!tokenInDB){
        return res.status(403).json(ApiResponse.error(
            500, 'Error refreshing the token', ['Refresh token not valid']
        ));
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(500).json(ApiResponse.error(
            500, 'Error refreshing the token', ['Refresh token not valid']
        ));
        const newAccessToken = generateToken({ id: user.id, name: user.name, role: user.role });
        res.status(200).json(ApiResponse.succes(
            200, 'Token refreshed', newAccessToken
        ));
    });
}


module.exports.login = login;
module.exports.refreshToken = refreshToken;