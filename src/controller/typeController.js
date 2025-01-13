import { typeService } from '../service/typeService.js';
import { successResponse, errorResponse } from '../util/responseUtil.js';

export const typeController = {
  getAll: async (req, res) => {
    try {
      const types = await typeService.getAll();
      return successResponse(res, "Types fetched successfully", types, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },
  save: async (req, res) => {
    try {
      const message = await typeService.save(req.body.typesData);
      return successResponse(res, message, null, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },
};

