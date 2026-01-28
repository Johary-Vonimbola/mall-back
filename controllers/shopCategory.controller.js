const ShopCategory = require('../models/ShopCategory');
const ApiResponse = require('../utils/ApiResponse');

const getAll = async (req, res) => {
    try {
        const shopCategorys = await ShopCategory.find();

        res.status(200).json(ApiResponse.succes(
            200,
            "Shop Categories record(s)",
            shopCategorys
        ));

    } catch (err) {
        res.status(500).json(ApiResponse.error(
            500,
            "Error retrieving Shop Categories",
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
                'Error creating Shop Category', 
                ['No information provided']
            ));
        }else{
            const shopCategory = new ShopCategory(body);
            await shopCategory.save();
            res.status(200).json(ApiResponse.succes(
                200, 
                'Shop Category created', 
                shopCategory
            ));
        }
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500,
            "Error creating Shop Category",
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
                'Error updating Shop Category', 
                ['No id provided']
            ));
        }
        const updateData = req.body;
        if(!updateData){
            res.status(500).json(ApiResponse.error(
                500, 
                'Error updating Shop Category', 
                ['No information provided']
            ));
        }
        const shopCategory = await ShopCategory.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(ApiResponse.succes(
            200, 
            'Shop Category updated', 
            shopCategory
        ));
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500, 
            'Error updating Shop Category', 
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
                'Error deleting Shop Category', 
                ['No id provided']
            ));
        }else{
            const deletedShopCategory = await ShopCategory.findByIdAndDelete(id);
            res.status(200).json(ApiResponse.succes(
                200, 
                'Shop Category deleted', 
                deletedShopCategory
            ));
        }
    }catch(err){
        res.status(500).json(ApiResponse.error(
            500, 
            'Error deleting Shop Category', 
            [err.message]
        ));   
    }
    res.end();
}

module.exports.save = save;
module.exports.getAll = getAll;
module.exports.update = update;
module.exports.remove = remove;