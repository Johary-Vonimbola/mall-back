const { PathPictureProduct } = require('../data/PathUpload');

const productUploadPath = (req, res, next) => {
    req.uploadPath = PathPictureProduct;
    next();
};

module.exports = {
    productUploadPath
};