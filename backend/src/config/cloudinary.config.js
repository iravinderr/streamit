import {v2 as cloudinary} from "cloudinary";

const connectCD = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        console.log("CLOUDINARY CONNECTED");
    } catch (error) {
        console.log("CLOUDINARY CONNECTION ERROR");
        console.log(error);
        process.exit(1);
    }
}

export default connectCD;