const Shop = require('../models/Shop');
const ApiResponse = require('../utils/ApiResponse');

const getAll = async (req, res) => {
    try {
        const shops = await Shop.find();

        res.status(200).json(ApiResponse.succes(
            200,
            "Shop record(s)",
            shops
        ));

    } catch (err) {
        res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving shops",
            err.message
        ));
    }
    res.end();
};

const save = async (req, res) => {
    try{
        const body = req.body;
        if(!body){
            res.status(500).json(ApiResponse.error(
                500, 
                'Error creating shop', 
                ['No information provided']
            ));
        }else{
            const shop = new Shop(body);
            await shop.save();
            res.status(200).json(ApiResponse.succes(
                200, 
                'Shop created', 
                shop
            ));
        }
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500,
            "Error creating shop",
            [err.message]
        ));
    }
    res.end();
};


const update = async (req, res) => {
    try{
        const id = req.params.id;
        if(!id){
            res.status(500).json(ApiResponse.error(
                500, 
                'Error updating shop', 
                ['No id provided']
            ));
        }
        const updateData = req.body;
        if(!updateData){
            res.status(500).json(ApiResponse.error(
                500, 
                'Error updating shop', 
                ['No information provided']
            ));
        }
        const shop = await Shop.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(ApiResponse.succes(
            200, 
            'Shop updated', 
            shop
        ));
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500, 
            'Error updating shop', 
            [err.message]
        ));   
    }
    res.end();
};

const remove = async (req, res) => {
    try{
        const id = req.params.id;
        if(!id){
            res.status(500).json(ApiResponse.error(
                500, 
                'Error deleting shop', 
                ['No id provided']
            ));
        }else{
            const deletedShop = await Shop.findByIdAndDelete(id);
            res.status(200).json(ApiResponse.succes(
                200, 
                'Shop deleted', 
                deletedShop
            ));
        }
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500, 
            'Error deleting shop', 
            [err.message]
        ));   
    }
    res.end();
}

const activate = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            res.status(400).json(ApiResponse.error(
                400,
                'Activation échouée',
                ['No shop id provided']
            ));
            return res.end();
        }

        const shop = await Shop.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        );

        if (!shop) {
            res.status(404).json(ApiResponse.error(
                404,
                'Shop not found',
                ['Shop does not exist']
            ));
            return res.end();
        }

        res.status(200).json(ApiResponse.succes(
            200,
            'Shop activated successfully',
            shop
        ));
        return res.end();

    } catch (err) {
        res.status(500).json(ApiResponse.error(
            500,
            'Error activating shop',
            [err.message]
        ));
        return res.end();
    }
};

const deactivate = async (req, res) => {
    try {
        const id = req.params.id;

        // Vérifier id
        if (!id) {
            res.status(400).json(ApiResponse.error(
                400,
                'Deactivation failed',
                ['No shop id provided']
            ));
            return res.end();
        }

        const shop = await Shop.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        // Vérifier si shop existe
        if (!shop) {
            res.status(404).json(ApiResponse.error(
                404,
                'Shop not found',
                ['Shop does not exist']
            ));
            return res.end();
        }

        res.status(200).json(ApiResponse.succes(
            200,
            'Shop deactivated successfully',
            shop
        ));
        return res.end();

    } catch (err) {
        res.status(500).json(ApiResponse.error(
            500,
            'Error deactivating shop',
            [err.message]
        ));
        return res.end();
    }
};


module.exports.save = save;
module.exports.getAll = getAll;
module.exports.update = update;
module.exports.remove = remove;
module.exports.activate = activate;
module.exports.deactivate = deactivate;