import { countryService } from "../service/countryService.js";
import { errorResponse, successResponse } from "../util/responseUtil.js";

export const countryController = {
    save: async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) {
                return errorResponse(res, "Name is required", 400);
            }

            const result = await countryService.save({name});

            return successResponse(res, result.message, result.data, 201);

        } catch (error) {
            return errorResponse(res, `Error saving country: ${error.message}`, 500);
        }
    },

    update: async (req, res) => {
        try {
            const id = req.params.id;
            const { name } = req.body;

            if (!name) {
                return errorResponse(res, "Name is required", 400);
            }

            const result = await countryService.update(id, name);

            return successResponse(res, result.message, result.data, 200);
        } catch (error) {
            return errorResponse(res, error.message || "Error updating country", 500);
        }
    }
};