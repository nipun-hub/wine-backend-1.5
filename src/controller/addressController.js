import {addressService} from "../service/addressService.js";

export const userAddressController = {

     //Add a new address.
    addAddress: async (req, res) => {
        try {
            const {userId, fullName, streetAddress, additionalAddress, city, state, zipCode, isDefault} = req.body;

            if (!userId || !fullName || !streetAddress || !city || !state || !zipCode) {
                return res.status(400).json({
                    success: false,
                    message: "All required fields (userId, fullName, streetAddress, city, state, zipCode) must be provided.",
                });
            }

            const newAddress = {
                fullName, streetAddress, additionalAddress, city, state, zipCode, isDefault,
            };

            const result = await addressService.addAddress(userId, newAddress);

            res.status(201).json({
                success: true, message: 'Address added successfully.', data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false, message: error.message || "An error occurred while adding the address.",
            });
        }
    },


     //Get all addresses for a user.
    getAddresses: async (req, res) => {
        try {
            const {userId} = req.params;

            if (!userId) {
                return res.status(400).json({
                    success: false, message: "User ID is required.",
                });
            }

            const result = await addressService.getAddresses(userId);

            res.status(200).json({
                success: true, message: 'address fetching successfully.', data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false, message: error.message || "An error occurred while retrieving the addresses.",
            });
        }
    },


     //Update a specific address.
    updateAddress: async (req, res) => {
        try {
            const {userId, addressId} = req.params;
            const updateDetails = req.body;

            if (!userId || !addressId) {
                return res.status(400).json({
                    success: false, message: "User ID and Address ID are required.",
                });
            }

            const result = await addressService.updateAddress(userId, addressId, updateDetails);

            res.status(200).json({
                success: true,
                message: 'Address Updated successfully.',
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false, message: error.message || "An error occurred while updating the address.",
            });
        }
    },


     //Delete a specific address.
    deleteAddress: async (req, res) => {
        try {
            const {userId, addressId} = req.params;

            if (!userId || !addressId) {
                return res.status(400).json({
                    success: false, message: "User ID and Address ID are required.",
                });
            }

            const result = await addressService.deleteAddress(userId, addressId);

            res.status(200).json({
                success: true,
                message: 'Address Deleted successfully.',
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false, message: error.message || "An error occurred while deleting the address.",
            });
        }
    },


     //Set a specific address as the default.
    setDefaultAddress: async (req, res) => {
        try {
            const {userId, addressId} = req.params;

            if (!userId || !addressId) {
                return res.status(400).json({
                    success: false, message: "User ID and Address ID are required.",
                });
            }

            const result = await addressService.setDefaultAddress(userId, addressId);

            res.status(200).json({
                success: true,
                message: 'Default address set successfully.',
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success: false, message: error.message || "An error occurred while setting the default address.",
            });
        }
    },
};
