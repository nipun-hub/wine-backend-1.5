import { wineRegionService } from '../service/wineRegionService.js';
import { successResponse, errorResponse } from '../util/responseUtil.js';

export const wineRegionController = {
    getAll: async (req, res) => {
        try {
            const wineRegions = await wineRegionService.getAll();
            return successResponse(res, "Wine Regions fetched successfully", wineRegions, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    add: async (req, res) => {
        try {
            // Extract region data from the request body
            const id = req.params.countryId;
            const { region } = req.body;

            if (!region) {
                return errorResponse(res, error.message, 400);
            }

            // Call the service to add a new region
            const message = await wineRegionService.add(id, region);
            // Respond with success
            return successResponse(res, message.message, message.newRegion, 201); // HTTP 201 for created resource
        } catch (error) {
            // Handle errors
            return errorResponse(res, error.message, 500);
        }
    },

    update: async (req, res) => {
        try {
            // Extract the Wine Region ID from the URL params and data from the request body
            const regionId = req.params.regionId;
            const { region } = req.body;

            if (!region) {
                return errorResponse(res, "region is required.")
            }

            // Call the updateRegion service
            const message = await wineRegionService.update(regionId, region);
            console.log(message);
            // Return success response
            return successResponse(res, message, null, 200);  // 200 OK status for successful update
        } catch (error) {
            // Handle any errors that occur during the update process
            return errorResponse(res, error.message, 500);  // 500 Internal Server Error status for failures
        }
    },

    deleteRegion: async (req, res) => {
        try {
            // Extract the Wine Region ID from the URL params
            const regionId = req.params.regionId;

            // Call the deleteRegion service
            const message = await wineRegionService.deleteRegion(regionId);

            // Return success response
            return successResponse(res, message, null, 200);  // 200 OK status for successful delete
        } catch (error) {
            // Handle any errors that occur during the delete process
            return errorResponse(res, error.message, 500);  // 500 Internal Server Error status for failures
        }
    },
};
