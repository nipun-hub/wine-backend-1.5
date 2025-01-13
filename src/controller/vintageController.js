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
      const message = await vintageService.save(req.body.vintagesData);
      return successResponse(res, message, null, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },
};
