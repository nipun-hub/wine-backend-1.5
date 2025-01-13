import cloudinary from '../config/cloudinaryConfig.js'; // Ensure the config file is being imported
import ImageModel from '../model/ImageModel.js';

// Use cloudinary.v2 for the upload
export const imageService = {
  uploadImage: async (section, imageFile) => {
    try {
      const result = await cloudinary.v2.uploader.upload(imageFile.path, {
        folder: `ecommerce-site/${section}`,
      });

      // Save the image URL to the database (if using MongoDB)
      await ImageModel.updateOne({ section }, { imageUrl: result.secure_url }, { upsert: true });

      return result.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Cloudinary upload failed.");
    }
  },

  getAllImages: async () => {
    const images = await ImageModel.find({});
    return images;
  },

  updateImage: async (section, imageFile) => {
    const result = await cloudinary.v2.uploader.upload(imageFile.path, {
      folder: `ecommerce-site/${section}`,
    });

    await ImageModel.updateOne({ section }, { imageUrl: result.secure_url });
    return result.secure_url;
  }
};
