import {wineRegionService} from '../service/wineRegionService.js';
import {successResponse, errorResponse} from '../util/responseUtil.js';

export const wineRegionController = {
    getAll: async (req, res) => {
        try {
            const wineRegions = await wineRegionService.getAll();
            return successResponse(res, "Wine Regions fetched successfully", wineRegions, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    save: async (req, res) => {
        try {
            const message = await wineRegionService.save(req.body.wineRegionsData);
            return successResponse(res, message, null, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    addRegion: async (req, res) => {
        try {
            // Extract region data from the request body
            const regionData = req.body;

            // Call the service to add a new region
            const message = await wineRegionService.add(regionData);

            // Respond with success
            return successResponse(res, message, null, 201); // HTTP 201 for created resource
        } catch (error) {
            // Handle errors
            return errorResponse(res, error.message, 500);
        }
    },

    updateRegion: async (req, res) => {
        try {
            // Extract the Wine Region ID from the URL params and data from the request body
            const regionId = req.params.regionId;
            const regionData = req.body;

            // Call the updateRegion service
            const message = await wineRegionService.updateRegion(regionId, regionData);


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
