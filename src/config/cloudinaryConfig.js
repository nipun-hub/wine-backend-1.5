import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


// Configure Cloudinary using the environment variables
cloudinary.config({
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: 'dty982jiw',
    api_key: '697195644536839',
    api_secret: 't_j3IOQgySFGfCHxjnU0E15K9JI',
});

export default cloudinary;
