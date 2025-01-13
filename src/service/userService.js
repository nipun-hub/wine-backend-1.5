import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import Token from "../model/Token.js";
import mongoose from "mongoose";

export const userService = {
    signup: async ({
                       firstName,
                       lastName,
                       email,
                       password,
                       isEmailVerified,
                       userType,
                   }) => {
        try {
            // Check if the user already exists
            const existingUser = await User.findOne({email: email});
            if (existingUser) {
                throw new Error("User already exists.");
            }

            const hashedPassword = await bcrypt.hash(
                password,
                parseInt(process.env.SALT_ROUNDS, 10) || 10
            );

            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                isEmailVerified,
                isEcomUser: userType === 1,
                isAdminUser: userType === 0,
            });

            const user = newUser.toObject();
            delete user.password;

            return {
                success: true,
                message: "User registered.",
                data: user,
            };
        } catch (error) {
            throw new Error(error.message || "User signup failed.");
        }
    },

    login: async ({email, password}) => {
        try {
            const existingUser = await User.findOne({email});
            if (!existingUser) {
                throw new Error("User not found.");
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                existingUser.password
            );
            if (!isPasswordValid) {
                throw new Error("Invalid email or password.");
            }

            const token = jwt.sign(
                {userId: existingUser._id},
                process.env.JWT_SECRET || 'cenzios',
                {expiresIn: "1h"}
            );

            const savedToken = await Token.create({
                userId: existingUser._id,
                token: token,
            });

            if (!savedToken) {
                throw new Error("Token generating error.");
            }

            const user = existingUser.toObject();
            delete user.password;
            return {token, user: user};
        } catch (error) {
            throw new Error(error.message || "Login failed.");
        }
    },

    checkPasswordSame: async ({userId, password}) => {
        try {
            const existingUser = await User.findOne({_id: userId});
            if (!existingUser) {
                throw new Error("User not found.");
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                existingUser.password
            );
            if (!isPasswordValid) {
                throw new Error("Invalid password.");
            }

        } catch (error) {
            throw new Error(error.message || "Login failed.");
        }
    },


    // Get user by ID
    getUserById: async (userId) => {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            throw new Error(error.message || "User fetch failed.");
        }
    },

    // Get all users with pagination
    getAllUsersPaginated: async ({page, limit, sortBy, sortOrder, filters}) => {
        try {
            const query = {};

            if (filters.userType) {
                query.userType = filters.userType;
            }
            if (filters.search) {
                query.$or = [
                    {firstName: {$regex: filters.search, $options: "i"}},
                    {lastName: {$regex: filters.search, $options: "i"}},
                    {email: {$regex: filters.search, $options: "i"}},
                ];
            }

            if (filters._id && mongoose.Types.ObjectId.isValid(filters._id)) {
                query._id = filters._id;
            }

            const options = {
                sort: {[sortBy]: sortOrder === "desc" ? -1 : 1},
                page: parseInt(page),
                limit: parseInt(limit),
            };

            const users = await User.paginate(query, options);
            return users;
        } catch (error) {
            throw new Error(error.message || "Failed to fetch users.");
        }
    },
    changeUserName: async (userId, firstName, lastName) => {
        try {

            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found.");
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {firstName, lastName},
                {new: true}
            );
            return updatedUser;
        } catch (error) {
            throw new Error(error.message || "Failed to change user name.");
        }
    },

    // update password
    updatePassword: async ({userId, oldPassword, newPassword}) => {
        try {
            // Fetch the user by ID
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                throw new Error("User not found.");
            }

            // Verify the old password
            const isPasswordValid = await bcrypt.compare(oldPassword, existingUser.password);
            if (!isPasswordValid) {
                throw new Error("Old password is incorrect.");
            }

            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(
                newPassword,
                parseInt(process.env.SALT_ROUNDS, 10) || 10
            );

            // Update the user's password
            existingUser.password = hashedNewPassword;
            await existingUser.save();

            return {
                success: true,
                message: "Password updated successfully.",
            };
        } catch (error) {
            throw new Error(error.message || "Failed to update password.");
        }
    },
    // Check if a user exists by email
    checkUserExistByEmail: async (email) => {
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return {
                    success: true,
                    message: "User already exists with this email.",
                    data: existingUser,
                    status: 200,
                };
            } else {
                return {
                    success: false,
                    message: "No user found with this email.",
                    status: 404,
                };
            }
        } catch (error) {
            throw new Error(error.message || "Failed to check user existence.");
        }
    },

};
