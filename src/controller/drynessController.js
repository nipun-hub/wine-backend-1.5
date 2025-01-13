import { drynessService } from '../service/drynessService.js';
import { successResponse, errorResponse } from '../util/responseUtil.js';

export const drynessController = {
  getAll: async (req, res) => {
    try {
      const drynessLevels = await drynessService.getAll();
      return successResponse(res, "Dryness levels fetched successfully", drynessLevels, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },

  save: async (req, res) => {
    try {
      const message = await drynessService.save(req.body.drynessData);
      return successResponse(res, message, null, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },
};
