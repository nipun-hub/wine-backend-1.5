import { errorResponse, successResponse } from "../util/responseUtil.js";
import { subRegionService } from "../service/subRegionService.js";

export const subRegionController = {
    add: async (req, res) => {
        try {
            const { countryId, regionId, subRegion } = req.body;

            if (!countryId || !regionId || !subRegion) {
                return errorResponse(res, "country id , region id and subRegion are required");
            }

            const result = await subRegionService.add(countryId, regionId, subRegion);

            return successResponse(res, result, 201)

        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    update: async (req, res) => {
        try {
            const subRegionId = req.params.subRegionId;
            const { name } = req.body;

            if (!name) {
                return errorResponse(res, "name is required");
            }

            const result = await subRegionService.update(subRegionId, name);

            return successResponse(res, result, 200);
        } catch (error) {
            console.log(error)
            return errorResponse(res, error.message, 500);
        }
    }
}