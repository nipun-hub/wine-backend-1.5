import { sizeService } from '../service/sizeService.js';
import { successResponse, errorResponse } from '../util/responseUtil.js';

export const sizeController = {
  getAll: async (req, res) => {
    try {
      const sizes = await sizeService.getAll();
      return successResponse(res, "Sizes fetched successfully", sizes, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },

  save: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return errorResponse(res, "Name is required", 400); // Validation for missing name
      }

      const result = await sizeService.save(name);

      if (result.status === "error") {
        return errorResponse(res, result.message, 400); // Handle cases like "Size already exists"
      }

      return successResponse(res, result.message, result.data, 201); // Return success with the saved data
    } catch (error) {
      return errorResponse(res, `Error saving size: ${error.message}`, 500);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!name) {
        return errorResponse(res, "Name is required", 400); // Validation for missing name
      }

      const result = await sizeService.update(id, name);

      if (result.status === "error") {
        return errorResponse(res, result.message, 400); // Handle error cases
      }

      return successResponse(res, result.message, result.data, 200); // Return success with the updated data
    } catch (error) {
      return errorResponse(res, `Error updating size: ${error.message}`, 500);
    }
  },

};
