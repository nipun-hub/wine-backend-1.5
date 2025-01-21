import Country from "../model/Country.js"
import SubRegion from "../model/SubRegion.js";
import WineRegion from "../model/WineRegion.js";

export const subRegionService = {
    add: async (countryId, regionId, subRegion) => {
        try {
            const country = await Country.findById(countryId);

            if (!country) {
                throw new Error("Country not found!");
            }

            const region = await WineRegion.findById(regionId);


            if (!region) {
                throw new Error("Region not found!");
            }

            const subRegionExist = await SubRegion.findOne({ name: subRegion });

            if (subRegionExist) {
                throw new Error(`subRegion ${subRegion} is already exist.`)
            }

            const newSubRegion = new SubRegion({ name: subRegion, mainRegionId: regionId })
            newSubRegion.save();

            region.subRegions.push(newSubRegion._id);
            region.save();

            return { success: true, message: `Wine subRegion ${subRegion} added successfully.`, data: newSubRegion };
        } catch (error) {
            throw new Error(error.message || "Error adding wine subRegion");
        }
    },

    update: async (subRegionId, name) => {
        console.log(subRegionId)
        console.log(name)
        try {
            const subRegion = await SubRegion.findById(subRegionId);

            if (!subRegion) {
                throw new Error("SubRegion is not found!")
            }

            const subRegionExist = await SubRegion.findOne({ name });

            if (subRegionExist && subRegionExist.id != subRegionId) {
                throw new Error(`Sub region ${name} is already exist.`)
            }

            const updatedSubRegion = await SubRegion.findByIdAndUpdate(subRegionId,{ name });

            return { success: true, message: `Sub region ${name} is updates`, data: updatedSubRegion };

        } catch (error) {
            console.log(error)
            throw new Error(error.message || "Error Sub region added")
        }
    }
}