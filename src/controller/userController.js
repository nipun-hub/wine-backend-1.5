import {userService} from "../service/userService.js";
import {isRequired, isValidEmail,} from "../util/validators.js";
import {errorResponse, successResponse} from "../util/responseUtil.js";

export const userController = {
    // Signup a new user
    signup: async (req, res) => {
        const {firstName, lastName, email, password, isEmailVerified, userType} = req.body;
        // console.log(req.body)
        try {
            // Validate required fields
            if (!isRequired(firstName) || !isRequired(lastName) || !isRequired(email) || !isRequired(password) || !isRequired(isEmailVerified) || !isRequired(userType)) {
                return errorResponse(res, "Required fields are missing.", 400);
            }

            // Validate email format
            if (!isValidEmail(email)) {
                return errorResponse(res, "Invalid email format.", 400);
            }

            // Create DTO and call service layer
            const dto = {
                firstName, lastName, email, password, isEmailVerified, userType,
            };

            const response = await userService.signup(dto);
            return successResponse(res, response.message, response.data, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Login user
    login: async (req, res) => {
        const {email, password} = req.body;

        try {
            // Validate required fields
            if (!isRequired(email) || !isRequired(password)) {
                return errorResponse(res, "Required fields are missing.", 400);
            }

            // Validate email format
            if (!isValidEmail(email)) {
                return errorResponse(res, "Invalid email format.", 400);
            }

            // Create DTO and call service layer
            const dto = {email, password};

            const result = await userService.login(dto);
            return successResponse(res, "Login successful.", result, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Get user by ID
    getUserById: async (req, res) => {
        const {userId} = req.params;
        try {
            const user = await userService.getUserById(userId);
            if (!user) {
                return errorResponse(res, "User not found.", 404);
            }
            return successResponse(res, "User fetched successfully.", user, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Get all users with pagination
    getAllUsers: async (req, res) => {
        const {page = 1, limit = 10, sortBy = 'firstName', sortOrder = 'asc'} = req.query;
        const filters = req.query;

        try {
            const users = await userService.getAllUsersPaginated({
                page,
                limit,
                sortBy,
                sortOrder,
                filters,
            });
            return successResponse(res, "Users fetched successfully.", users, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },
    changeUserName: async (req, res) => {
        const {userId} = req.params;
        const {firstName, lastName} = req.body;
        try {

            if (!firstName || !lastName) {
                return errorResponse(res, "First name and last name are required.", 400);
            }

            const response = await userService.changeUserName(userId, firstName, lastName);
            return successResponse(res, "User name changed successfully.", response, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // check password is same
    checkPasswordSame: async (req, res) => {
        const {password} = req.body;
        const {userId} = req.params;

        try {
            // Validate required fields
            if (!isRequired(userId)) {
                return errorResponse(res, "Required fields are missing.", 400);
            }

            const result = await userService.checkPasswordSame({userId, password});
            return successResponse(res, "Password is same", result, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Update password
    updatePassword: async (req, res) => {
        const {oldPassword, newPassword} = req.body;
        const {userId} = req.params;

        try {
            // Validate required fields
            if (!isRequired(oldPassword) || !isRequired(newPassword)) {
                return errorResponse(res, "Old password and new password are required.", 400);
            }

            // Call the updatePassword service
            const response = await userService.updatePassword({
                userId,
                oldPassword,
                newPassword,
            });

            return successResponse(res, response.message, null, 200);
        } catch (err) {
            return errorResponse(res, err.message, err.statusCode || 500);
        }
    },

    // Controller to check if user exists by email
    checkUserExistByEmail: async (req, res) => {
        const {email} = req.body;

        try {
            const result = await userService.checkUserExistByEmail(email);

            if (result.success) {
                // User exists, send a response indicating user exists
                return res.status(200).json({
                    success: true,
                    message: result.message,
                    data: result.data, // Optionally return user data
                });
            } else {
                // User does not exist, return a message
                return res.status(404).json({
                    success: false,
                    message: result.message,
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal server error.',
            });
        }
    },

};
