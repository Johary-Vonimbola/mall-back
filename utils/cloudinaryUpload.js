const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (folderName, fileBuffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folderName
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        stream.end(fileBuffer);
    });
};

module.exports = uploadToCloudinary;