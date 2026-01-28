const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');


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
        const { name, _id } = user;
        const accessToken = jwt.sign({ id: _id, name: name, role: role }, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json(ApiResponse.succes(
            200, 'User logged', accessToken
        ));
    }catch(err){
        return res.status(500).json(ApiResponse.error(
            500, 'Error login user', [err.message]
        ));
    }
}

module.exports.login = login;