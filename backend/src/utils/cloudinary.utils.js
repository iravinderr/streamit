import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


const uploadToCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) return null;
        
        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}


export { uploadToCloudinary };