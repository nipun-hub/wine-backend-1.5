import WineRegion from '../model/WineRegion.js';
import SubRegion from "../model/SubRegion.js";

export const wineRegionService = {
    getAll: async () => {
        try {
            const wineRegions = await WineRegion.find();
            return wineRegions;
        } catch (error) {
            throw new Error(`Error fetching Wine Regions: ${error.message}`);
        }
    },

    save: async (wineRegionsData) => {
        try {
            const count = await WineRegion.countDocuments();
            if (count === 0) {
                await WineRegion.insertMany(wineRegionsData);
                return "Wine Regions seeded successfully.";
            }
            return "Wine Regions already have data. Skipping seeding.";
        } catch (error) {
            throw new Error(`Error saving Wine Regions: ${error.message}`);
        }
    },

    add: async (regionData) => {
        try {
            // Validate input
            if (!regionData || !regionData.region) {
                throw new Error("Invalid region data. A 'region' field is required.");
            }

            // Check if the region already exists
            const existingRegion = await WineRegion.findOne({region: regionData.region.trim()});
            if (existingRegion) {
                return `Wine Region "${regionData.region}" already exists.`;
            }

            // Create the WineRegion
            const newRegion = new WineRegion({region: regionData.region});
            await newRegion.save();

            // If subRegions are provided, create and associate them
            if (regionData.subRegions && Array.isArray(regionData.subRegions) && regionData.subRegions.length > 0) {
                const subRegionIds = [];
                for (const subRegionName of regionData.subRegions) {
                    const subRegion = new SubRegion({name: subRegionName, mainRegionId: newRegion._id});
                    await subRegion.save(); // Save each sub-region
                    subRegionIds.push(subRegion._id);
                }

                // Update the WineRegion with the associated sub-regions
                newRegion.subRegions = subRegionIds;
                await newRegion.save();
            }

            return `Wine Region "${regionData.region}" and associated sub-regions added successfully.`;
        } catch (error) {
            console.error("Error in wineRegionService.add:", error);
            throw new Error(`Error adding Wine Region: ${error.message}`);
        }
    },

    updateRegion: async (regionId, regionData) => {
        try {
            // Validate the input
            if (!regionId || !regionData) {
                throw new Error("Region ID and region data are required.");
            }

            // Find the existing WineRegion by its ID
            const existingRegion = await WineRegion.findById(regionId);
            if (!existingRegion) {
                throw new Error("Wine Region not found.");
            }

            // Update the region name if it's provided
            if (regionData.region) {
                existingRegion.region = regionData.region;
            }

            // Handle sub-regions update
            if (regionData.subRegions) {
                // Remove old sub-regions
                await SubRegion.deleteMany({mainRegionId: existingRegion._id});

                // Create and save new sub-regions
                const subRegionIds = [];
                for (const subRegionName of regionData.subRegions) {
                    const subRegion = new SubRegion({name: subRegionName, mainRegionId: existingRegion._id});
                    await subRegion.save();
                    subRegionIds.push(subRegion._id);
                }

                // Update the subRegions in the WineRegion
                existingRegion.subRegions = subRegionIds;
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
            await SubRegion.deleteMany({mainRegionId: deletedRegion._id});

            return {
                message: "Wine Region deleted successfully.",
            };
        } catch (error) {
            console.error("Error in wineRegionService.deleteRegion:", error);
            throw new Error(`Error deleting Wine Region: ${error.message}`);
        }
    },

};
