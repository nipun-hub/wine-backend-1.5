import { contextsKey } from "express-validator/lib/base.js";
import Country from "../model/Country.js"

export const countryService = {
    save: async (countryData) => {
        console.log(countryData);
        try {
            const country = await Country.findOne({ name: countryData.name });
            if (country) {
                return { success: false, message: "Country already exists.", data: [] };
            }

            const newCountry = new Country(countryData);
            const savedCountry = await newCountry.save();
            return { success: true, message: "Country saved successfully.", data: savedCountry };

        } catch (error) {

        }
    },

    update: async (id, name) => {
        try {
            const country = await Country.findById(id);
            if (!country) {
                throw new Error(`Country with ID not found.`);
            }

            const existingCountry = await Country.findOne({ name });
            if (existingCountry && existingCountry._id.toString() !== id) {
                throw new Error(`Country with name ${name} already exists.`);
            }

            const result = await Country.findByIdAndUpdate(id, {name}, { new: true });
            return { success: true, message: "Country updated successfully.", data: result };
        } catch (error) {
            throw new Error(error.message || "Error updating country.");
        }
    }
}