import { imageService } from "../service/imageService.js";
import { successResponse, errorResponse } from '../util/responseUtil.js';

export const imageController = {
  uploadImage: async (req, res) => {
    try {
      const { section } = req.body; // e.g., banner, hero, logo, etc.
      const imageFile = req.file; // Assuming you use multer for file uploads
        // console.log(section,imageFile)
      const imageUrl = await imageService.uploadImage(section, imageFile);
      return successResponse(res, 'Image uploaded successfully', { imageUrl }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },

  getImages: async (req, res) => {
    try {
      const images = await imageService.getAllImages();
      return successResponse(res, 'Images fetched successfully', images, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },

  updateImage: async (req, res) => {
    try {
      const { section } = req.body; // e.g., banner, hero, logo, etc.
      const imageFile = req.file;

      const updatedImageUrl = await imageService.updateImage(section, imageFile);
      return successResponse(res, 'Image updated successfully', { updatedImageUrl }, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
};
