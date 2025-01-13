import {membershipPlanService} from '../service/membershipPlanService.js';
import {successResponse, errorResponse} from '../util/responseUtil.js';

export const membershipPlanController = {
    getAll: async (req, res) => {
        try {
            const membershipPlans = await membershipPlanService.getAll();
            return successResponse(res, "Membership Plans fetched successfully", membershipPlans, 200);
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    },

    save: async (req, res) => {
        try {
            const result = await membershipPlanService.save(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({success: false, message: error.message});
        }

    },

    update: async (req, res) => {
        try {
            const result = await membershipPlanService.update(req.params.id, req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({success: false, message: error.message});
        }
    }
};
