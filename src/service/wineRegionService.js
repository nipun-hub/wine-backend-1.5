import WineRegion from '../model/WineRegion.js';
import SubRegion from "../model/SubRegion.js";
import Country from '../model/Country.js';

export const wineRegionService = {
    getAll: async () => {
        try {
            const wineRegions = await WineRegion.find();
            return wineRegions;
        } catch (error) {
            throw new Error(`Error fetching Wine Regions: ${error.message}`);
        }
    },

    add: async (id, region) => {
        try {

            const country = await Country.findById(id);
            if (!country) {
                throw new Error("Country not found.");
            }

            // Validate input
            if (!region) {
                throw new Error("Invalid region data. A 'region' field is required.");
            }

            // Check if the region already exists
            const existingRegion = await WineRegion.findOne({ region: region.trim() });
            if (existingRegion) {
                throw new Error(`Wine Region ${region} already exists.`)
            }

            // Create the WineRegion
            const newRegion = new WineRegion({ region: region });
            await newRegion.save();

            // add region to country
            country.regions.push(newRegion._id);
            await country.save();

            return { success: true, message: `Wine Region ${region} added successfully.`, newRegion };
        } catch (error) {
            throw new Error(`Error adding Wine Region: ${error.message}`);
        }
    },


    update: async (regionId, region) => {
        try {

            // Find the existing WineRegion by its ID
            const existingRegion = await WineRegion.findById(regionId);
            if (!existingRegion) {
                throw new Error("Wine Region not found.");
            }

            const checkExist = await WineRegion.findOne({ region });
            if (checkExist && checkExist._id != regionId) {
                throw new Error("Region are already exist ")
            }

            // Update the region name if it's provided
            if (region) {
                existingRegion.region = region;
            }

            // Save the updated WineRegion document
            await existingRegion.save();

            return {
                message: "Wine Region updated successfully.", region: {
                    ...existingRegion.toObject(),
                    subRegions: await Promise.all(existingRegion.subRegions.map(async subRegionId => {
                        const subRegion = await SubRegion.findById(subRegionId);
                        return subRegion ? subRegion.name : null;
                    })),
                },
            };

            // return {
            //     message: "Wine Region updated successfully.",
            //     region: existingRegion,
            // };

        } catch (error) {
            console.error("Error in wineRegionService.updateRegion:", error);
            throw new Error(`Error updating Wine Region: ${error.message}`);
        }
    },

    deleteRegion: async (regionId) => {
        try {
            // Validate input
            if (!regionId) {
                throw new Error("Region ID is required.");
            }

            // Find and delete the WineRegion by ID
            const deletedRegion = await WineRegion.findByIdAndDelete(regionId);

            if (!deletedRegion) {
                throw new Error("Wine Region not found.");
            }

            // Delete associated sub-regions
            await SubRegion.deleteMany({ mainRegionId: deletedRegion._id });

            return {
                message: "Wine Region deleted successfully.",
            };
        } catch (error) {
            console.error("Error in wineRegionService.deleteRegion:", error);
            throw new Error(`Error deleting Wine Region: ${error.message}`);
        }
    },

};
