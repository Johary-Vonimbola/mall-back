const User = require('../models/User');
const ApiResponse = require('../utils/ApiResponse');
const jwt = require('jsonwebtoken');


const login = async(req, res) => {
    try{
        if(!req.body){
            res.status(500).json(ApiResponse.error(
                500, 'Error when login', ['Body request not provided']
            ));
        }else{
            const { username, password } = req.body;
            if(!username || !password){
                res.status(500).json(ApiResponse.error(
                    500, 'Error when login', ['Username or password not provided']
                ));
            }else{
                const user = await User.findOne({name: username, passwordHash: password});
                if(!user){
                    res.status(500).json(ApiResponse.error(
                        500, 'Error when login', ['Wrong information, user not found']
                    )); 
                }else{
                    const { name, _id } = user;
                    const accessToken = jwt.sign({ name: name, id: _id }, process.env.ACCESS_TOKEN_SECRET);
                    res.status(200).json(ApiResponse.succes(
                        200, 'User logged', accessToken
                    ));
                }
            }
        }
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500, 'Error login user', [err.message]
        ));
    }
    res.end();
}


const save = async (req, res) => {
    try{
        const body = req.body;
        if(!body){
            res.status(500).json(ApiResponse.error(
                500, 'Error creating user', ['No information provided']
            ));
        }else{
            const user = new User(body);
            await user.save();
            res.status(200).json(ApiResponse.succes(
                200, 'User created', user
            ));
        }
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500, 'Error creating user', [err.message]
        ));
    }
    res.end();
}

const getAll = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(ApiResponse.succes(
            200, 'User record(s)', users
        ));
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500, 'Error fetching user record(s)', [err.message]
        ));
    }
    res.end();
};

const update = async (req, res) => {
    try{
        const id = req.params.id;
        if(!id){
            res.status(500).json(ApiResponse.error(
                500, 'Error updating user', ['No id provided']
            ));
        }
        const updateData = req.body;
        if(!updateData){
            res.sattus(500).json(ApiResponse.error(
                500, 'Error updating user', ['No information provided']
            ));
        }
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(ApiResponse.succes(
            200, 'User updated', user
        ));
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500, 'Error updating user', [err.message]
        ));   
    }
    res.end();
};

const remove = async (req, res) => {
    try{
        const id = req.params.id;
        if(!id){
            res.status(500).json(ApiResponse.error(
                500, 'Error deleting user', ['No id provided']
            ));
        }else{
            const deletedUser = await User.findByIdAndDelete(id);
            res.status(200).json(ApiResponse.succes(
                200, 'User deleted', deletedUser
            ));
        }
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500, 'Error deleting user', [err.message]
        ));   
    }
    res.end();
}

module.exports.login = login;
module.exports.save = save;
module.exports.getAll = getAll;
module.exports.update = update;
module.exports.remove = remove;