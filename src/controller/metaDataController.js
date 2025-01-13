import { metaDataService } from '../service/metaDataService.js';
import { successResponse, errorResponse } from '../util/responseUtil.js';

export const metaDataController = {
  fetchMetaData: async (req, res) => {
    try {
      // Call the service to fetch all metadata
      const metaData = await metaDataService.fetchAllMetaData();
      return successResponse(res, 'Metadata fetched successfully', metaData, 200);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
};
