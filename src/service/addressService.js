import UserAddress from "../model/Address.js";
import User from "../model/User.js";

export const addressService = {
    // Add a new address for a user.
    addAddress: async (userId, addressDetails) => {
        try {

            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found.");
            }

            // Check if the user already has an address record
            let userAddress = await UserAddress.findOne({userId: userId});

            // Create a new UserAddress document if none exists
            if (!userAddress) {
                userAddress = new UserAddress({userId: userId, addresses: []});
            }

            // If the new address is set as default, unset existing defaults
            if (addressDetails.isDefault) {
                userAddress.addresses.forEach(address => (address.isDefault = false));
            }

            // Add the new address
            userAddress.addresses.push(addressDetails);

            // Save the updated address record
            await userAddress.save();

            return {
                success: true,
                message: "Address added successfully.",
                data: userAddress,
            };
        } catch (error) {
            throw new Error(error.message || "Failed to add address.");
        }
    },

    // Get all addresses for a user.
    getAddresses: async (userId) => {
        try {
            const userAddress = await UserAddress.findOne({userId}).populate("userId", "name email");

            if (!userAddress || userAddress.addresses.length === 0) {
                return {success: true, message: "No addresses found.", data: []};
            }

            return {
                success: true,
                message: "Addresses retrieved successfully.",
                data: userAddress.addresses,
            };
        } catch (error) {
            // console.log(error)
            throw new Error(error.message || "Failed to retrieve addresses.");
        }
    },

    // Update a specific address.
    updateAddress: async (userId, addressId, updateDetails) => {
        try {
            const userAddress = await UserAddress.findOne({userId});

            if (!userAddress) throw new Error("User not found.");

            const address = userAddress.addresses.id(addressId);
            if (!address) throw new Error("Address not found.");

            // If the updated address is set as default, unset existing defaults
            if (updateDetails.isDefault) {
                userAddress.addresses.forEach(addr => (addr.isDefault = false));
            }

            // Update the address details
            Object.assign(address, updateDetails);

            // Save changes
            await userAddress.save();

            return {
                success: true,
                message: "Address updated successfully.",
                data: userAddress.addresses,
            };
        } catch (error) {
            throw new Error(error.message || "Failed to update address.");
        }
    },

    // Delete a specific address.
    deleteAddress: async (userId, addressId) => {
        try {
            const userAddress = await UserAddress.findOne({userId: userId});

            if (!userAddress) throw new Error("User not found.");

            const addressIndex = userAddress.addresses.findIndex(addr => addr._id.toString() === addressId);
            if (addressIndex === -1) throw new Error("Address not found.");

            // Remove the address
            userAddress.addresses.splice(addressIndex, 1);

            // Save changes
            await userAddress.save();

            return {
                success: true,
                message: "Address deleted successfully.",
                data: userAddress.addresses,
            };
        } catch (error) {
            throw new Error(error.message || "Failed to delete address.");
        }
    },

    // Set a specific address as the default.
    setDefaultAddress: async (userId, addressId) => {
        try {
            const userAddress = await UserAddress.findOne({ userId});

            if (!userAddress) throw new Error("User not found.");

            const address = userAddress.addresses.id(addressId);
            if (!address) throw new Error("Address not found.");

            // Set all addresses to not default
            userAddress.addresses.forEach(addr => (addr.isDefault = false));

            // Set the selected address as default
            address.isDefault = true;

            // Save changes
            await userAddress.save();

            return {
                success: true,
                message: "Default address set successfully.",
                data: userAddress.addresses,
            };
        } catch (error) {
            throw new Error(error.message || "Failed to set default address.");
        }
    },
};
