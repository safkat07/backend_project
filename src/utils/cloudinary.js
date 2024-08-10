import { v2 as cloudinary } from "cloudinary";

import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        // file has been successfully uploaded
        console.log("File successfully uploaded", response.url);
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the temporary file

        return null
    }

}

export { uploadOnCloudinary }