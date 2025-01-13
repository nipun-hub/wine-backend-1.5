import { collectableService } from '../service/collectableService.js';
import { successResponse, errorResponse } from '../util/responseUtil.js';

export const collectableController = {
  getAll: async (req, res) => {
    try {
      const collectables = await collectableService.getAll();
      return successResponse(res, "Collectables fetched successfully", collectables, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },

  save: async (req, res) => {
    try {
      const message = await collectableService.save(req.body.collectablesData);
      return successResponse(res, message, null, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },
};
