import { vintageService } from '../service/vintageService.js';
import { successResponse, errorResponse } from '../util/responseUtil.js';

export const vintageController = {
  getAll: async (req, res) => {
    try {
      const vintages = await vintageService.getAll();
      return successResponse(res, "Vintages fetched successfully", vintages, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },

  save: async (req, res) => {
    try {
      const { year, description } = req.body;
      const message = await vintageService.save({ year, description });
      return successResponse(res, message.message, message.data, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { year, description } = req.body;
      if (!id) return errorResponse(res, "Id is required", 400);
      if (!year) return errorResponse(res, "Year is required", 400);

      const message = await vintageService.update(id, { year, description });
      return successResponse(res, message.message, message.data, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },
};
