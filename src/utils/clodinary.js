
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary';



    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.COUDINARY_NAME,
        api_key: process.env.COUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_SECRET_KEY // Click 'View Credentials' below to copy your API secret
    });
    
    const uploadOnCloudinary = async(localfilePath)=>{
        try {
            
            if(!localfilePath) return null
            // file upload
            const response = await cloudinary.uploader.upload(localfilePath,{resource_type:'auto'}) 
            // file uploaded successfully
            // console.log('file has been uploaded successfuly',response.url)
            fs.unlinkSync(localfilePath)
            return response
        } catch (error) {
            // remove the temporary file when operation get failed
            fs.unlinkSync(localfilePath)
            return null
        }
    }


  export {uploadOnCloudinary}


    // // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });
    
    // console.log(autoCropUrl);    
